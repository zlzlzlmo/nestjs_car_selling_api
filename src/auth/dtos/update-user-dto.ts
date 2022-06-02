import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
