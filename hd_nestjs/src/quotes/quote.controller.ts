import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCustomInquiryDto, CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteService } from './quote.service';

@Controller()
export class QuoteController {
  constructor(private readonly quotes: QuoteService) { }

  @Post('quotes')
  create(@Body() dto: CreateQuoteDto) {
    try {
      return this.quotes.create(dto);
    } catch (error) {
      console.error('Controller Error:', error);
      throw error;
    }
  }

  @Post('workspace-inquiries')
  createWorkspaceInquiry(@Body() dto: CreateCustomInquiryDto) {
    return this.quotes.createWorkspaceInquiry(dto);
  }

  @Get('quotes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() { return this.quotes.findAll(); }
}