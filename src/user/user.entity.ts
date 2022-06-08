// import { Exclude } from 'class-transformer';
import { Report } from 'reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';
// 엔티티를 만들면 프로퍼티를 정의한다
// 그리고 해당 모듈에 연결 시켜준다  (repository를 생성해주는거)
// 그리고 root connection에 연결해준다(app module에 등록)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude()
  @Column()
  password: string;

  // 앱이 처음 구동될때는 해당 클래스를 참조를 못한다.
  // 때문에 콜백으로 해당 클래스를 반환하는 식으로 하는것이다. circular dependency
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // 업데이트 되거나 리무브 됐을때 작동하는 데코레이터 (훅 데코레이터)
  @AfterInsert()
  logInsert() {
    console.log('inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed User with id', this.id);
  }
}
