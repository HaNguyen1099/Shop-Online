import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class ProductDto {
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
