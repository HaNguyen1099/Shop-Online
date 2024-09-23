import { IsString, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class OptionDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 5;

  @IsString()
  @IsOptional()
  sortKey?: string;

  @IsString()
  @IsOptional()
  sortValue?: string;

  @IsString()
  @IsOptional()
  keyword?: string;
}
