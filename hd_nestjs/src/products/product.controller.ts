import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly products: ProductService) {}

  // Get all published products
  @Get()
  findPublished() {
    return this.products.findPublished();
  }

  // Get single product by article number
  // Example: /products/ART-123
  @Get(':articleNumber')
  findByArticleNumber(@Param('articleNumber') articleNumber: string) {
    return this.products.findByArticleNumber(articleNumber);
  }

  // Admin: get all products
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.products.findAll();
  }

  // Admin: create product
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  // Admin: update product by database id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(id, dto);
  }

  // Admin: delete product by database id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.products.remove(id);
  }
}