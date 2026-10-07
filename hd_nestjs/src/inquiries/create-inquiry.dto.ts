import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInquiryDto {
  // CUSTOMER INFORMATION
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // PRODUCT INFORMATION
  @IsString()
  category!: string;

  @IsString()
  productCategory!: string;

  @IsOptional()
  @IsString()
  productDetail?: string;

  // FABRIC & STYLE
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

  // CUSTOMIZATION
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsArray()
  sizes?: string[];

  // OTHER
  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}