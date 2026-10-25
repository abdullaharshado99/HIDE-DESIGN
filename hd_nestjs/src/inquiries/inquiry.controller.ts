import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateInquiryDto } from './create-inquiry.dto';
import { InquiryService } from './inquiry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('inquiries')
export class InquiryController {
  constructor(
    private readonly inquiryService: InquiryService,
  ) { }

  @Post()
  async create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiryService.create(createInquiryDto);
  }

  @Get()
  async findAll() {
    return this.inquiryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.remove(id);
  }
}