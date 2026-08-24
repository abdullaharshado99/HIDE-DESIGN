import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @MaxLength(60) articleNumber?: string;
  @IsString() @MaxLength(160) name?: string;
  @IsString() @MaxLength(30) category?: string;
  @IsString() @MaxLength(30) audience?: string;
  @IsString() @MaxLength(120) material?: string;
  @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsString() @MaxLength(1500) imageUrl?: string;
  @IsOptional() @IsBoolean() published?: boolean;
}