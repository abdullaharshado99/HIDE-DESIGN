import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WardrobeItem } from '../entities/wardrobe-item.entity';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeService } from './wardrobe.service';

@Module({
    imports: [TypeOrmModule.forFeature([WardrobeItem]), AuthModule],
    controllers: [WardrobeController],
    providers: [WardrobeService],
})
export class WardrobeModule { }