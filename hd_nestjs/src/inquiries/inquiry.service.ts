import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../entities/inquiry.entity';
import { CreateInquiryDto } from './create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) { }

  async create(createInquiryDto: CreateInquiryDto) {
    const inquiry = this.inquiryRepository.create({
      ...createInquiryDto,
      sizes: createInquiryDto.sizes ? JSON.stringify(createInquiryDto.sizes) : '',
    });

    return this.inquiryRepository.save(inquiry);
  }

  async findAll() {
    return this.inquiryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    return this.inquiryRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const inquiry = await this.findOne(id);
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    await this.inquiryRepository.remove(inquiry);
    return { deleted: true, id };
  }

  async markAsRead(id: number) {
    await this.inquiryRepository.update(id, { isRead: true });
    return { success: true };
  }
}