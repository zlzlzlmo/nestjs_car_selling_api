import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
// 크립토는 nodejs에 들어있는 표준 라이브러리임
// randomBytes는 솔트를 위한 메서드로 랜덤한 스트링을 만들어준다.
// scrypt는 해쉬를 해주는 함수이다.
// scypt는 callback으로 값을 받는 비동기 함수이므로 promise로 값을 받는 형태로 전환해서 사용하는것이 좋다.
import { randomBytes, scrypt as _scrypt } from 'crypto';

// util도 nodejs 표준 라이브러리
// callback funtion을 사용하는 메서드를 promise를 사용하는 메서드로 변환 시켜준다.
import { promisify } from 'util';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 회원가입할때는 salt와 hash를 사용하여 해커들이 여러 값들을 얻은 다이제스트들이 모여있는 rainbow table이 생성되는것을 방지할 수 있다.
  // 솔트는 임의의 문자열을 덧붙이는거
  // 해쉬는 단방향으로 완전히 다른 문자열로 변환시켜 암호화 처리를 하는것이다. (단방향이라는것은 복호화가 불가능한 암호화 기법이라는 것이다. / 양방향은 복호화가 가능하다.) // 다이제스트는 해쉬에 의해 암호화된 데이터를 의미한다.
  // 즉 솔트와 해쉬를 같이 사용하면 같은 패스워드를 입력해도 다른 문자열이 생성된다.
  // 해쉬만 사용하게되면 같은 문자열을 입력했을대 완전히 똑같은 암호화된 문자열이 나오게 되고 이것은 해커로 부터 레인보우 테이블을 생성할 위험성을 안겨준다.

  async signup(email: string, password: string): Promise<User> {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // randomBytes는 버퍼를 반환함 (0과 1로 이루어져있는 데이터 형태의 배열 집합)
    // 8 바이트의  랜덤 스트링을 헥사코드로 변환
    // 16자리가 들어올것
    const salt = randomBytes(8).toString('hex');

    // 32글자의 해쉬 암호가 생성됨 32바이트
    // 버퍼는 주기억 장치(RAM - 비휘발성 메모리)에 있는 임시 저장 공간
    // 버퍼는 raw 바이너리  데이터를 저장할 수 있는 특수한 형태의 객체. ( raw binary란 0과 1을 의미한다.)
    // 배열이랑 굉장히 비슷한 형태 -> 차이점은 버퍼는 그 안에 raw data를 가지고 있는다.
    const hash = await this.hash(password, salt);

    // . 로 구분을 둬서 왼쪽은 salt 오른쪽은 hash임을 명시
    const result = salt + '.' + hash;

    const user = await this.userService.create(email, result);

    return user;
  }

  async signin(email: string, password: string): Promise<User> {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const [salt, storedHash] = user.password.split('.');

    // 입력된 password를 아까 만들었었던 해쉬 함수를 사용하여 만듬
    // 해쉬는 입력된 값이 같으면 같은 해쉬로 만들어지기때문에 가능
    const hash = await this.hash(password, salt);

    if (storedHash !== hash) {
      throw new BadRequestException('비밀번호가 틀렸습니다');
    }

    return user;
  }

  private async hash(password: string, salt: string): Promise<string> {
    const result = (await scrypt(password, salt, 32)) as Buffer;
    return result.toString('hex');
  }
}
