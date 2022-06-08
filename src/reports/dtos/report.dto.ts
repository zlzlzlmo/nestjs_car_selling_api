import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  // obj는 originial 엔티티가 들어온다 (즉, 여기서는 Report 엔티티가 들어오는것이다.)
  // 리턴값을 userId로 보내는것
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;

  //   @Expose()
  //   userId() {
  //     return this.user.id;
  //   }

  //   @Exclude()
  //   user: User;
}
