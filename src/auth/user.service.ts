import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  // User 엔티티를 담당하는 typeorm repository의 인스턴스를 생성
  // repository가 user를 담당하기 위함
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    // create를 하고 save를 해줘야한다.
    // create는 user 엔티티의 인스턴스를 생성해준다
    // save는 생성된 엔티티 인스턴스를 디비에 넣어준다

    // create로 인스턴스를 안만들고 바로 객체를 넣어도 디비에 저장은 된다.
    // 하지만, 만약 엔티티에 훅과 같은 데코레이터를 사용하여 어떠한 로직을 추가 작성했을때, 그 메서드를 실행하질 못한다 (예를들어, AfterInsert()와 같은것들이 실행이 되질 않는다)
    // 여러 버그가 발생할 수 있다.
    // 때문에 create를 사용하여 instance 를 만들어 그것을 save해주도록 한다.
    const user = this.repo.create({ email, password });
    const result = await this.repo.save(user);
    return result;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.repo.findOneBy({ id });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async find(email: string): Promise<User[]> {
    // findBy는 존재하지 않을시 빈배열로 들어옴
    const result = await this.repo.findBy({ email });

    if (result.length < 1) {
      throw new NotFoundException();
    }

    return result;
  }

  // update, insert, delete 는 부분만 들어가기때문에 instance가 아니고 plain object로 취급되어 hook이 발생안된다.
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // 새로 업데이트 된걸로 유저 객체를 오버라이딩 후 save
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  // remove는 엔티티로 삭제
  // delete는 Partial같은 부분적인 plain object로 삭제 가능
  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
