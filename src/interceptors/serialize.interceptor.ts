/* eslint-disable @typescript-eslint/ban-types */
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// 생성자만 타입으로 받음
interface ClassConstructor {
  new (...args: any): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// 인터셉터는 요청이 처음 들어왔을때 (핸들러에 도달전 작동)
// 핸들러 처리가 끝나고 응답값으로 나가기전에 작동
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // context는 인커밍 요청에 대한 정보가 담겨잇다.
    // 요청 핸들러에 의해 요청이 처리되기전에 작동한다
    // console.log('컨트롤러 핸들러에 도달 전 작동 : ', context);

    // next는 요청 핸들러에 참조된 종류
    // findUser를 참조하면 findUser를 나타낸다
    // 즉 next는 핸들러임!

    //excludeExtraneousValues를 true로 설정해야만 dto에서 설정한 프로퍼티가 그대로 들어온다.
    // extraneous는 관계없는 이라는 뜻이다.
    // 만약 저걸 false로 할시 인스턴스의 프로퍼티가 그대로 들어온다.

    return next.handle().pipe(
      map((data: any) => {
        // return 을 꼭 넣어서 변환된 것을 반환해주자.
        // 생성자로 dto를 받아서 더 flexible 하게 처리가 가능하다.
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
        // console.log('핸들러 처리 끝나고 응답값 나가기 전 작동 : ', data);
      }),
    );
  }
}
