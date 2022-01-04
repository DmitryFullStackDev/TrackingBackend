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
import { SendToken } from './dto/sendToken.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('singIn')
  async login(@Request() req) {
    return this.authService.singIn(req.user);
  }

  @UsePipes(ValidationPipe)
  @Post('singUp')
  async registration(@Body() dto: CreateUsersDto) {
    return this.authService.signUp(dto);
  }

  @UsePipes(ValidationPipe)
  @Post('confirm')
  async confirm(@Body() dto: SendToken) {
    return this.authService.confirm(dto);
  }
}
