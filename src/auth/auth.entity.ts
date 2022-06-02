import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
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

  @Column()
  password: string;

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
