import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@automock/jest';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();

    userController = unit;
    userService = unitRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
