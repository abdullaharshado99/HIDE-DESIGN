import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateInquiryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  category!: string;

  @IsString()
  productCategory!: string;

  @IsOptional()
  @IsString()
  productDetail?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  fabricType?: string;

  @IsOptional()
  @IsString()
  gsm?: string;

  @IsOptional()
  @IsString()
  fitStyle?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsArray()
  sizes?: string[];

  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}