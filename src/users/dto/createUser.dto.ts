import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUsersDto {
  @IsString({ message: 'email should be string ' })
  @IsEmail({}, { message: 'wrong type of email' })
  readonly email: string;

  @IsString({ message: 'password should be string' })
  @Length(4, 15, { message: 'password should be from 4 to 15 symbols' })
  readonly password: string;

  status: 'pending' | 'blocked' | 'active' = 'pending';
  role = 'user';
}
