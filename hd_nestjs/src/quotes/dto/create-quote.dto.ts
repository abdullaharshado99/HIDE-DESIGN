import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuoteDto {
  @IsString() name?: string;
  @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string; 
  @IsString() category?: string;
  @IsString() message?: string;
}

export class CreateCustomInquiryDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsString() phone!: string;
  @IsOptional() @IsString() company?: string;
  @IsString() productName!: string;
  @IsString() articleNumber!: string;
  @IsString() color!: string;
  @IsOptional() @IsString() fabricType?: string;
  @IsOptional() @IsString() fabricGsm?: string;
  @IsArray() @IsString({ each: true }) sizes!: string[];
  @Type(() => Number) @IsNumber() @Min(1) quantity!: number;
  @IsString() unit!: string;
  @IsString() additionalNotes!: string;
  @IsOptional() @IsString() designFileUrl?: string;
  @IsOptional() @IsString() specifications?: string;
}