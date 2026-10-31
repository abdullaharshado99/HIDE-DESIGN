import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order } from '../entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { User } from 'src/entities/user.entity';
import { WardrobeItem } from 'src/entities/wardrobe-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, User, WardrobeItem]), AuthModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }