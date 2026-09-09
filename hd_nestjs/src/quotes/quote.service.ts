import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Quote } from '../entities/quote.entity';
import { CreateCustomInquiryDto, CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuoteService {
  constructor(@InjectRepository(Quote) private readonly quotes: Repository<Quote>) { }

  async create(dto: CreateQuoteDto) {
    try {
      console.log('Received data:', dto);
      const quote = await this.quotes.save(this.quotes.create(dto));
      console.log('✅ Quote saved to database:', quote.id);

      try {
        await this.sendEmailNotification(quote);
      } catch (emailError: any) {
        console.error('❌ Email failed (but data saved):', emailError.message);
      }

      return quote;
    } catch (dbError: any) {
      console.error('❌ Database Error:', dbError.message);
      console.error(dbError.stack); 
      throw dbError; 
    }
  }

  async createWorkspaceInquiry(dto: CreateCustomInquiryDto) {
    const message = this.buildCustomInquiryMessage(dto);
    const quote = await this.quotes.save(this.quotes.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      category: 'Custom Inquiry',
      message,
    }));

    try {
      await this.sendWhatsAppNotification(dto);
    } catch (whatsappError: any) {
      console.error('❌ Workspace inquiry WhatsApp failed (but data saved):', whatsappError.message);
    }

    return quote;
  }

  findAll() { return this.quotes.find({ order: { createdAt: 'DESC' } }); }

  private async sendWhatsAppNotification(inquiry: CreateCustomInquiryDto): Promise<void> {
    const apiUrl = process.env.WASPHERE_API_URL?.replace(/\/+$/, '');
    const apiKey = process.env.WASPHERE_API_KEY;
    const workspaceId = process.env.WASPHERE_WORKSPACE_ID;
    const sessionId = process.env.WASPHERE_SESSION_ID;
    const recipient = (
      process.env.QUOTE_WHATSAPP_RECIPIENTS?.split(',')[0] ??
      '+923044885277'
    ).replace(/\D/g, '');

    if (!apiUrl || !apiKey || !workspaceId || !sessionId || !recipient) {
      throw new Error(
        'Missing WASPHERE_API_URL, WASPHERE_API_KEY, WASPHERE_WORKSPACE_ID, WASPHERE_SESSION_ID, or QUOTE_WHATSAPP_RECIPIENTS',
      );
    }

    const endpoint = `${apiUrl}/workspaces/${encodeURIComponent(workspaceId)}/proxy/api/sessions/${encodeURIComponent(sessionId)}/messages/text`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipient,
        text: this.buildCustomInquiryMessage(inquiry, true),
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`WaSphere returned ${response.status} for ${recipient}: ${responseText}`);
    }

    console.log(`✅ Workspace inquiry WhatsApp sent to ${recipient}:`, responseText);
  }

  private async sendEmailNotification(quote: Quote) {
    const sender = process.env.EMAIL_USER?.trim();
    const password = process.env.EMAIL_PASS?.replace(/\s/g, '');
    const recipients = (process.env.QUOTE_EMAIL_RECIPIENTS ?? 'admin@hidesdesign.com')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    if (!recipients.length) {
      throw new Error('Missing QUOTE_EMAIL_RECIPIENTS or EMAIL_USER');
    }

    if (!sender || !password) {
      throw new Error('Missing EMAIL_USER or EMAIL_PASS');
    }

    if (password.includes(',') || password.includes('//')) {
      throw new Error('EMAIL_PASS must contain one App Password for EMAIL_USER, without commas or comments');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST ?? 'smtp.zoho.com',
      port: Number(process.env.EMAIL_SMTP_PORT ?? 465),
      secure: process.env.EMAIL_SMTP_SECURE !== 'false',
      auth: {
        user: sender,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: `New Quote Request from ${quote.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">New Quote Request</h2>
          <pre style="background: #f9f9f9; padding: 15px; white-space: pre-wrap; font-family: Arial, sans-serif;">${this.escapeHtml([
            `Name: ${quote.name}`,
            `Email: ${quote.email}`,
            `Phone: ${quote.phone ?? ''}`,
            `Category: ${quote.category}`,
            `Message: ${quote.message ?? ''}`,
          ].join('\n'))}</pre>
        </div>
      `,
    });
  }

  private buildCustomInquiryMessage(dto: CreateCustomInquiryDto, whatsapp = false) {
    let specifications = '';
    if (dto.specifications) {
      try {
        const parsed = JSON.parse(dto.specifications) as Record<string, unknown>;
        specifications = Object.entries(parsed)
          .filter(([, value]) => value)
          .map(([key, value]) => `${this.formatLabel(key)}: ${value}`)
          .join('\n');
      } catch {
        specifications = dto.specifications;
      }
    }

    return [
      whatsapp ? 'New Custom Sample Inquiry' : 'Product Inquiry Details',
      '',
      `Name: ${dto.name}`,
      `Company: ${dto.company ?? ''}`,
      `Email: ${dto.email}`,
      `Phone: ${dto.phone}`,
      '',
      `Product Name: ${dto.productName}`,
      `Article Number: ${dto.articleNumber}`,
      `Color: ${dto.color}`,
      `Fabric Type: ${dto.fabricType ?? ''}`,
      `Fabric GSM: ${dto.fabricGsm ?? ''}`,
      `Sizes: ${dto.sizes.join(', ')}`,
      `Quantity: ${dto.quantity} ${dto.unit}`,
      specifications ? `Specifications:\n${specifications}` : '',
      dto.designFileUrl ? `Design File: ${dto.designFileUrl}` : '',
      '',
      `Additional Notes:\n${dto.additionalNotes}`,
    ].filter(Boolean).join('\n');
  }

  private formatLabel(value: string) {
    return value.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase()).trim();
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

}