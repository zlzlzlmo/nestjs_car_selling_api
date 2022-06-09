import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

// DI를 위해서 providers에 주입할 클래스를 넣어줘야한다.

// {
//   provide: APP_INTERCEPTOR,
//   useClass: CurrentUserInterceptor,
// },
// 를 사용함으로써 전역으로 사용할 인터셉터를 지정할수있다.

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthService],
  controllers: [UserController],
})

// 인터셉터 로직을 지우고 미들웨어로 대체
// 쿠키세션 미들웨어 작동 후 작동
// 나중에 jwt 검증도 여기서 하면 될듯?
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
