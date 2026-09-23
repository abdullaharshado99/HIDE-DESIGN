import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inquiry } from '../entities/inquiry.entity';
import { CreateInquiryDto } from './create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async create(createInquiryDto: CreateInquiryDto) {
    const inquiry = this.inquiryRepository.create({
      ...createInquiryDto,
      sizes: createInquiryDto.sizes
        ? JSON.stringify(createInquiryDto.sizes)
        : '',
    });

    return this.inquiryRepository.save(inquiry);
  }

  async findAll() {
    return this.inquiryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return this.inquiryRepository.findOne({
      where: { id },
    });
  }
}