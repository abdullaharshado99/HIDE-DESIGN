import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Request() req: { user: { sub: number } }, @Body() dto: UpdateProfileDto) {
        return this.customers.updateProfile(req.user.sub, dto);
    }
}