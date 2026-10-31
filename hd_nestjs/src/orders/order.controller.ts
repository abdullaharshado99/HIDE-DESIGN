import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly orders: OrderService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req: { user: { sub: number } }, @Body() dto: any) {
        return this.orders.create(req.user.sub, dto);
    }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    checkout(@Request() req: { user: { sub: number } }, @Body() dto: any) {
        return this.orders.checkout(req.user.sub, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getUserOrders(@Request() req: { user: { sub: number } }) {
        return this.orders.getUserOrders(req.user.sub);
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, AdminGuard)
    findAll() {
        return this.orders.findAllWithUserDetails();
    }
}