import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

// 컨트롤러에 있는 Query와 같은 데코레이터들은 유닛테스트에서 진행하지 않는다!!!
// 데코레이터와 같은 모든걸 테스트 하는것은 e2e테스트에서 진행한다!!!!!
describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'zlzlzlmo@daum.net',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdas' } as User]);
      },
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  test('정의', () => {
    expect(controller).toBeDefined();
  });

  test('findAllUsers가 적상적으로 주어진 파라미터대로 알맞은 유저가 리턴', async () => {
    const users = await controller.findAllUsers('zlzlzlmo@naver.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('zlzlzlmo@naver.com');
  });

  test('user id를 넣었을때 해당 하는 유저가 정상 출력', async () => {
    const user = await controller.findUser('1');

    if (!user) {
      return;
    }

    expect(user.id).toEqual(1);
  });

  test('유저가 존재하지 않을때 에러 메시지 출력', async () => {
    fakeUserService.findOne = () => null;

    try {
      const user = await controller.findUser('1');
      expect(user).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('유저가 없습니다.');
    }
  });

  test('signin 에서 로그인과 세션 정보가 잘 들어가는지', async () => {
    const session = { userId: -100 };
    const user = await controller.signin(
      { email: 'zlzlzlmo@daum.net', password: 'test' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
