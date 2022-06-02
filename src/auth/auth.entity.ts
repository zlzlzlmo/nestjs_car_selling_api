import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
}
