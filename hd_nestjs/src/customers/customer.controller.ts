import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Controller('customers')
export class CustomerController {
    constructor(private readonly customers: CustomerService) { }

    @Post('register')
    register(@Body() dto: CreateCustomerDto) {
        return this.customers.register(dto);
    }

    @Post('login')
    login(@Body() dto: CustomerLoginDto) {
        return this.customers.login(dto);
    }
}