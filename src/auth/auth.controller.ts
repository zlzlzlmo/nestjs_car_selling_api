import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  @Post()
  Signup(@Body() signUpDto: SignUpDto) {
    console.log(signUpDto);
  }
}
