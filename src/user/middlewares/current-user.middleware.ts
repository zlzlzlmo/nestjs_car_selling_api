import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'user/user.service';

// 인터셉터는 가드 후 발생하고
// 가드 전에 인터셉터 역할을 하는것을 만들고 싶으면 미들웨어를 사용한다
// 커스텀 미들웨어는 가드가 발생하기 전에 실행된다.
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }

    // next는 미들웨어 로직이 끝났으므로 다음 실행으로 넘어가도록한다 ( 여기 앱에서는 가드 )
    next();
  }
}
