import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWardrobeItemDto {
    @IsString()
    articleNumber!: string;

    @IsString()
    name!: string;

    @IsString()
    imageUrl!: string;

    @IsOptional()
    @IsString()
    material?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price?: number;


    @IsOptional()
    @IsString()
    currency?: string;
}