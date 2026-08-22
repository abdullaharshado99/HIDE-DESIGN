import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQuoteDto {
  @IsString() @MaxLength(160) name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsString() @MaxLength(80) category: string;
  @IsString() message: string;
}