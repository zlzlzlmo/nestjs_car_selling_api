import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

// DI를 위해서 providers에 주입할 클래스를 넣어줘야한다.

// {
//   provide: APP_INTERCEPTOR,
//   useClass: CurrentUserInterceptor,
// },
// 를 사용함으로써 전역으로 사용할 인터셉터를 지정할수있다.

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
  controllers: [UserController],
})
export class AuthModule {}
