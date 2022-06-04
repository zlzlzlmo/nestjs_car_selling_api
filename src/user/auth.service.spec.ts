import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Partail을 사용하여 필요한 메서드들을 스트릭하게 설정하자
    const fakeUserService: Partial<UserService> = {
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
});
