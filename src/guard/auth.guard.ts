import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// CanActivate 는 interceptor하고 매우 비슷한 인터페이스이다.

// 요청 -> Guard -> Controller -> Handler -> Response
// 위 flow는 요청 들어오자마자 바로 가드를 타는것 (모든 컨트롤러에 적용)
// 하지만 Guard는 개별적인 컨트롤러에만 적용시킬수있고, handler에만 적용시킬수있고 유연하게 원하는 곳에 옮겨서 사용할수있다.

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
