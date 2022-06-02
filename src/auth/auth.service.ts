import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';

@Injectable()
export class AuthService {
  // User 엔티티를 담당하는 typeorm repository의 인스턴스를 생성
  // repository가 user를 담당하기 위함
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    // create를 하고 save를 해줘야한다.
    const user = this.repo.create({ email, password });
    const result = await this.repo.save(user);
    return result;
  }
}
