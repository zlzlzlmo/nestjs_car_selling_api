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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateuserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user.dto';

// DTO는 인커밍 요청도 처리가 되지만 아웃고잉 리스폰스도 인터셉트해서 처리가 가능하다.

//요청이 들어온다 -> 컨트롤러 -> 서비스 -> 엔티티 인스턴스 생성 후  repository -> 다시 컨트롤러 ->
// -> class serializer interceptor (엔티티를 어떠한 규칙을 기반으로 plain object로 변경) -> 응답

// 예를들어 엔티티에서 password를 exclude하면 서비스에서 로직 처리 후 컨트롤러에 가는 과정에서 인터셉서 후 엔티티에서 만든 규칙에 따라 password를 제외한 나머지를 응답값으로 보내준다.
// 인터셉터를 하고싶은 컨트롤러 데코레이터 위에 useInterceptor 데코레이터 설정 후 class serializer interceptor 를 인자로 넣어준다.

// 커스텀 인터셉터를 처리하면 엔티티에서 Exclude하는 것을 안한다. (dto를 사용하여 처리할것)

// 만약 admin페이지가 있고 일반 client가 페이지가 있는데 두 계정 라우팅 응답값에 다른 객체형태를 보내려면 어떻게해야하나 ?
// custom interceptor를 만들어서 사용한다 (dto를 사용하여)

@Controller('auth')
@Serialize(UserDto) //이곳에다 놓으면 모든 컨트롤러의 핸들러에 해당 인터셉터의 dto를 적용가능하다.
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  createUser(@Body() { email, password }: CreateuserDto) {
    return this.authService.create(email, password);
  }

  // 요청으로 들어온 파라미터는 모두 스트링이다.
  // 때문에 parseint로 변경해줘야한다.
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // Decorator를 만들어서 위 처럼 길게 사용한것을 줄일 수 있다.
  // @Serialize(UserDto)
  @Get(':id')
  findUser(@Param('id') id: string) {
    // console.log('핸들러 작동중');
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
