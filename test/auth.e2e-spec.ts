import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // send 메서드로 바디 보내기
  // userId 프로퍼티 undefined 이슈
  // 부트스트램 메서드는 nest 어플리케이션을 만들어내고 쿠키세션과 validation 파이프와 같은 미들웨어들을 같이 묶어버린다.
  // 그리고 요청들을 해당 포트에서 대기한다.
  // 하지만 e2e 테스트에서는 main.ts가 작동을 하는것이아니라서 쿠키세션과 validation pipe와 같은 미들웨어도 작동하지 않는다
  // 때문에 500에러가 발생한다.
  it('signup 요청 핸들러', () => {
    const email = 'z111lzlzadsasdaaaaaasdaslmo@daum.net';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'test' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
