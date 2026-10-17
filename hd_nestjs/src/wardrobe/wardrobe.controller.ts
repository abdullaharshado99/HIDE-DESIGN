import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { WardrobeService } from './wardrobe.service';

@Controller('wardrobe')
@UseGuards(JwtAuthGuard)
export class WardrobeController {
    constructor(private readonly wardrobe: WardrobeService) { }

    @Post()
    addItem(
        @Request() req: { user: { sub: number } },
        @Body() dto: CreateWardrobeItemDto,
    ) {
        return this.wardrobe.addItem(req.user.sub, dto);
    }

    @Get()
    getItems(@Request() req: { user: { sub: number } }) {
        return this.wardrobe.getUserItems(req.user.sub);
    }

    @Delete(':id')
    removeItem(
        @Request() req: { user: { sub: number } },
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.wardrobe.removeItem(req.user.sub, id);
    }
}