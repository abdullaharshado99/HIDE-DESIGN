import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../auth/admin.guard';
import { Inquiry } from '../entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), AuthModule],
  controllers: [InquiryController],
  providers: [InquiryService, AdminGuard],
  exports: [InquiryService],
})
export class InquiryModule { }