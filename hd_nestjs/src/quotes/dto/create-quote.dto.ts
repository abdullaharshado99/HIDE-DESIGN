import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsString() name?: string;
  @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string; 
  @IsString() category?: string;
  @IsString() message?: string;
}