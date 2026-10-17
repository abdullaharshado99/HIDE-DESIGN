import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    phone!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}