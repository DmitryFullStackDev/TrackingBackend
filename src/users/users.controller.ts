import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUsersDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUsersDto) {
    return this.usersService.createUser(userDto);
  }

  @Get('/all')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Get('/:email')
  getSpecificUser(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
