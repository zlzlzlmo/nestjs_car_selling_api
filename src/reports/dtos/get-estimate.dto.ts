import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  // 기본적으로 파라미터는 string으로 들어오기때문에 transform을 해준다.
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2030)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
