import { IntersectionType, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { IdDto } from '../base/api/base.dto';

export class ProductDto extends IntersectionType(
  PartialType(IdDto),
) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  quantity?: number;
}
