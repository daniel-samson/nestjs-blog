import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';
import { UsersRepository } from './users.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserDTO, 'password'>> {
    if (createUserDto.password) {
      const rounds = this.configService.get<number>('app.bcryptRounds');
      const hash = await bcrypt.hash(createUserDto.password, rounds);
      createUserDto.password = hash;
    }
    const user = this.usersRepository.create(createUserDto);
    // never return password hash!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return rest;
  }

  async findAll(): Promise<Array<Omit<UserDTO, 'password'>>> {
    const usersFound = await this.usersRepository.find();
    return usersFound.map((user: User) => {
      // never return password hash!
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      return rest;
    });
  }

  async findOne(userId: number): Promise<Omit<UserDTO, 'password'>> {
    const result = await this.usersRepository.findOne({
      where: {
        userId,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    // never return password hash!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = result;
    return user as UserDTO;
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<Omit<UserDTO, 'password'> | null> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      // never return password hash!
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      return rest;
    }

    return null;
  }

  async update(updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.password) {
      const rounds = this.configService.get<number>('app.bcryptRounds');
      const hash = await bcrypt.hash(updateUserDto.password, rounds);
      updateUserDto.password = hash;
    }

    this.usersRepository.update(
      {
        userId: updateUserDto.userId,
      },
      updateUserDto,
    );
    return;
  }

  remove(userId: number): Promise<DeleteResult> {
    this.usersRepository.delete(userId);
    return;
  }
}
