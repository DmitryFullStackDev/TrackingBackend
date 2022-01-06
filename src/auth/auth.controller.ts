import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CreateUsersDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { SendToken } from './dto/sendToken.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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

  @UsePipes(ValidationPipe)
  @Post('confirm')
  async confirm(@Body() dto: SendToken) {
    return this.authService.confirm(dto);
  }

  @UsePipes(ValidationPipe)
  @Post('forgotPassword')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('changePassword')
  async changePassword(@GetUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto);
  }
}
