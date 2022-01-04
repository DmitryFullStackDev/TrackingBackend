import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/all')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Get('/:email')
  getSpecificUser(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get()
  sendMail(): any {
    return this.usersService.example();
  }
}
