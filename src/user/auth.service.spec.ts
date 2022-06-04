import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    // Partail을 사용하여 필요한 메서드들을 스트릭하게 설정하자
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    // 직접적으로 UserService에 요청하여 거기에 있는 메서드를 사용하는 과정이 없는 것이다.
    // 때문에 카피본을 뜨고 거기에 사용되는 fake 메서드들을 정의하여 내뱉어야한다.
    // 어떠한 인스턴스가 UserService의 copy를 요청하면 usevalue에 있는 것을 내뱉으라는 뜻이다.
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    // get을 사용함으로써 DI컨테이너를 생성한다 ( 해당 서비스의 인스턴스를 만들어 낸다 )
    // authservice는 userService를 의존성 주입을 받고 있기때문에, fake user service를 의존성 주입을 해야한다.ㄴ
    service = module.get(AuthService);
  });

  test('authservice 인스턴스 생성', async () => {
    expect(service).toBeDefined();
  });

  test('암호화된 형태로 유저 생성', async () => {
    const user = await service.signup('zlzlzlmo@daum.net', 'test');
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // throw 에러 처리
  test('이미 존재하는 계정이 있다면 에러 출력', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'zlzlzlmo@daum.net', password: 'test' } as User,
      ]);

    try {
      await service.signup('zlzlzlmo@daum.net', 'test');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('이미 존재하는 이메일입니다.');
    }
  });

  test('유저가 없다면 에러 출력', async () => {
    try {
      await service.signin('zlzlzlmo@daum.net', 'test');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('유저가 존재하지 않습니다.');
    }
  });

  test('비밀번호가 틀리다면 틀리다는 에러메시지 출력', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'zlzlzlmo@daum.net',
          password: 'testPassword',
        } as User,
      ]);
    try {
      await service.signin('zlzlzlmo@daum.net', 'testPassword');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('비밀번호가 틀렸습니다');
    }
  });

  // 암호화된 케이스를 테스트했을때는 signup을 했을때 나오는 암호화된 해시값을 복사하여 테스트 케이스에 넣어서 테스트를 진행한다.
  test('존재하는 유저 입력시 올바르게 로그인', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'zlzlzlmo@daum.net',
          password:
            'dae037ca04956480.21c26488bed97733380bb28246cf1a3fc81e321d20bc8eed8511125b0bbcb694',
        } as User,
      ]);
    const user = await service.signin('zlzlzlmo@daum.net', 'testPassword');
    expect(user).toBeDefined();
  });
});
