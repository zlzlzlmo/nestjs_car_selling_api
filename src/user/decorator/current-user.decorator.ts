import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//context는 incoming request 정보가 담겨있다. 웹소켓 메시지가 될수도있고 http 요청이 될수도 있고 들어오는 여러 요청 정보들이 담겨있다고 보면된다.
// data에는 데코레이터 인자로 넘긴것이 들어온다.
// data type을 never로 사용하면 인자를 받지 않겠다고 지정하는것이다.
// 데코레이터에 인자를 넘기면 에러가 발생한다.
// return 된게 데코레이터 반환값으로 빠진다.

// createParamDecorator은 DI시스템을 이용못해 의존성 주입을 못한다.
// 그래서 userService를 이용하기위해 인터셉터를 사용해야한다.
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // .switchToHttp().getRequest() 을 사용하여 클라이언트 요청을 get할수잇다.

    const request = context.switchToHttp().getRequest();
    console.log(request);

    // currentUserInterceptor에서 등록한 request 정보에 currentUser를 넣어서 return 이 가능한거다.
    // interceptors 폴더에 currentUserInterceptor 인터셉터 클래스를 만들고 거기서 로직을 처리한다.
    // 그리고 모듈의 providers에 해당 인터셉터를 넣어준다
    // useInterceptors 데코레이터 인자에 currentUserInterceptor 를 임포트해서 넣어주면 해당 인터셉터가 작동된다
    // 그리고 CurrentUser 의 데코레이터를 사용한 헨들러의 api를 요청하면 해당 데코레이터 리턴값이 반환된다.
    return request.currentUser;
  },
);
