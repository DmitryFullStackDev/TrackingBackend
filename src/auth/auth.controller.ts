import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUsersDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UsePipes(ValidationPipe)
  @Post('registration')
  async registration(@Body() dto: CreateUsersDto) {
    return this.authService.registration(dto);
  }
}
