import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// CanActivate 는 interceptor하고 매우 비슷한 인터페이스이다.

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
