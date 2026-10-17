import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WardrobeItem } from '../entities/wardrobe-item.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';

@Injectable()
export class WardrobeService {
    constructor(
        @InjectRepository(WardrobeItem)
        private readonly items: Repository<WardrobeItem>,
    ) { }

    async addItem(userId: number, dto: CreateWardrobeItemDto) {
        const existing = await this.items.findOne({
            where: { userId, articleNumber: dto.articleNumber },
        });

        if (existing) {
            return existing;
        }

        return this.items.save(
            this.items.create({
                userId,
                ...dto,
            }),
        );
    }

    async getUserItems(userId: number) {
        return this.items.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async removeItem(userId: number, id: number) {
        const item = await this.items.findOne({ where: { id, userId } });
        if (!item) throw new NotFoundException('Wardrobe item not found');
        await this.items.remove(item);
        return { deleted: true };
    }
}