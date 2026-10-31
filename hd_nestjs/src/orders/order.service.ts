import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { WardrobeItem } from 'src/entities/wardrobe-item.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(WardrobeItem) private readonly wardrobe: Repository<WardrobeItem>,
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

    async findAllWithUserDetails() {
        const allOrders = await this.orders.find({ order: { createdAt: 'DESC' } });

        const detailedOrders = await Promise.all(allOrders.map(async (order) => {
            const user = await this.users.findOne({ where: { id: order.userId } });
            const userWardrobe = await this.wardrobe.find({ where: { userId: order.userId } });

            return {
                ...order,
                customer: user ? {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                } : { name: 'Deleted User', email: 'N/A', phone: 'N/A' },
                currentWardrobeItems: userWardrobe
            };
        }));
        return detailedOrders;
    }
}