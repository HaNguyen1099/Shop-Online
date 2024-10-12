import { IntersectionType, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsDate, IsArray } from 'class-validator';
import { IdDto } from '../base/api/base.dto';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  quantity?: number;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsArray()
  @IsOptional()
  images?: string[];
}
