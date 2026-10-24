import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { WardrobeItem } from 'src/entities/wardrobe-item.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        private readonly dataSource: DataSource,
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

    async checkout(userId: number, dto: any) {
        return this.dataSource.transaction(async (manager) => {
            const order = manager.create(Order, {
                userId,
                items: dto.items,
                totalAmount: dto.totalAmount,
                paymentMethod: dto.paymentMethod,
                shippingAddress: dto.shippingAddress,
                phone: dto.phone,
                status: 'pending',
            });
            await manager.save(order);
            await manager.delete(WardrobeItem, { userId });

            return order;
        });
    }
}