import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInquiryDto {
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
  vintageEffect?: string;

  @IsOptional()
  @IsString()
  fitStyle?: string;

  @IsOptional()
  @IsString()
  printingTechnique?: string;

  @IsOptional()
  @IsString()
  rhinestone?: string;

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
  fileName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}