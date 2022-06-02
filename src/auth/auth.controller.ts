import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  createUser(@Body() { email, password }: CreateuserDto) {
    return this.authService.create(email, password);
  }

  // 요청으로 들어온 파라미터는 모두 스트링이다.
  // 때문에 parseint로 변경해줘야한다.
  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.authService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.authService.find(email);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.update(parseInt(id), body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.authService.remove(parseInt(id));
  }
}
