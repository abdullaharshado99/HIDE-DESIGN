import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
    ) { }

    async create(userId: number, dto: any) {
        const order = this.orders.create({
            userId,
            items: dto.items,
            totalAmount: dto.totalAmount,
            paymentMethod: dto.paymentMethod,
            shippingAddress: dto.shippingAddress,
            phone: dto.phone,
            status: 'pending',
        });
        return this.orders.save(order);
    }

    async getUserOrders(userId: number) {
        return this.orders.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findAll() {
        return this.orders.find({ order: { createdAt: 'DESC' } });
    }
}