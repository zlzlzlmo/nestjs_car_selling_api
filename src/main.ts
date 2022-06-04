/* eslint-disable @typescript-eslint/no-var-requires */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 세션은 서버에서 가지고 있는 정보
  // 쿠키는 서버에서 발급된 세션을 열기 위한 키값임 (세션 ID)

  // whitelist를 true로하면 dto에 설정한 프로퍼티 외 다른 것이 들어올때 자동으로 필터링해준다.
  await app.listen(3000);
}
bootstrap();
