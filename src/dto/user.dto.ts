import { IntersectionType, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { IdDto } from '../base/api/base.dto';

export class UserDto extends IntersectionType(
  PartialType(IdDto),
) {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {message: 'password too short'})
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
