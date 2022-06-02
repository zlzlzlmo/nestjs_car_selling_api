import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  createUser(@Body() { email, password }: CreateuserDto) {
    return this.authService.create(email, password);
  }
}
