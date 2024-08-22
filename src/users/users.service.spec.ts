import { TestBed } from '@automock/jest';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import AppConfig from '@/config/app.config';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: jest.Mocked<UsersRepository>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          load: [AppConfig],
        }),
      ],
    }).compile();
    const configService = module.get<ConfigService>(ConfigService);

    const { unit, unitRef } = TestBed.create(UsersService)
      .mock(ConfigService)
      .using(configService)

      .compile();

    userService = unit;
    userRepository = unitRef.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create user and hash password', async () => {
    userRepository.create.mockImplementation((user) => ({
      userId: 1,
      username: user.username,
      password: '$2b$10$9Iycoln0ELwjuDZdcggjou1SCo75v8MOjWjjXf4HJk82KyyTM/5b2', // 'admin'
      created_at: 1,
    }));

    const result = await userService.create({
      username: 'admin',
      password: 'admin',
    });

    expect(result.userId).toEqual(1);
    expect(result.username).toEqual('admin');
    // @ts-expect-error users/client must never be able to see password hashes
    expect(result.password).not.toBeDefined();
  });

  it('should return array of users and not leak the password', async () => {
    const users: User[] = [
      {
        userId: 1,
        username: 'admin',
        password: 'admin',
        created_at: 1724238405,
      },
    ];
    userRepository.find.mockResolvedValue(users);

    const result = await userService.findAll();
    expect(result).toEqual(
      users.map((u) => ({
        userId: u.userId,
        username: u.username,
        created_at: u.created_at,
      })),
    );
    // @ts-expect-error users/client must never be able to see password hashes
    expect(result[0].password).not.toBeDefined();
  });

  it('retrieves a single user but omits the password', async () => {
    userRepository.findOne.mockImplementation((options: FindOneOptions<User>) =>
      Promise.resolve({
        userId: (options.where as FindOptionsWhere<User>).userId,
        username: 'admin',
        password: 'admin',
        created_at: 1,
      } as User),
    );

    const result = await userService.findOne(1);
    expect(result.userId).toEqual(1);
    expect(result.username).toEqual('admin');
    // @ts-expect-error users/client must never be able to see password hashes
    expect(result.password).not.toBeDefined();
  });

  it('it should sign in successfully and return userId and username', async () => {
    userRepository.findOne.mockImplementation((options: FindOneOptions<User>) =>
      Promise.resolve({
        userId: 1,
        username: (options.where as FindOptionsWhere<User>).username,
        password:
          '$2b$10$9Iycoln0ELwjuDZdcggjou1SCo75v8MOjWjjXf4HJk82KyyTM/5b2', // 'admin'
        created_at: 1,
      } as User),
    );

    const result = await userService.signIn('admin', 'admin');
    expect(result).not.toBeNull();
    expect(result.username).toEqual('admin');
    expect(result.userId).toEqual(1);
    // @ts-expect-error users/client must never be able to see password hashes
    expect(result.password).not.toBeDefined();
  });

  it('it should fail to signin and return null with a wrong password', async () => {
    userRepository.findOne.mockImplementation((options: FindOneOptions<User>) =>
      Promise.resolve({
        userId: 1,
        username: (options.where as FindOptionsWhere<User>).username,
        password:
          '$2b$10$9Iycoln0ELwjuDZdcggjou1SCo75v8MOjWjjXf4HJk82KyyTM/5b2', // 'admin'
        created_at: 1,
      } as User),
    );

    const result = await userService.signIn('admin', 'wrong_password');
    expect(result).toBeNull();
  });

  it('should update user', async () => {
    const obj = new UpdateResult();
    obj.raw = '';
    obj.generatedMaps = [];
    userRepository.update.mockResolvedValue(obj);

    await userService.update({
      userId: 1,
      password: 'new_password',
    });

    expect(userRepository.update).toHaveBeenCalled();
  });

  it('should delete user', async () => {
    const obj = new DeleteResult();
    obj.raw = '';
    userRepository.delete.mockResolvedValue(obj);

    await userService.remove(1);

    expect(userRepository.delete).toHaveBeenCalled();
  });
});
