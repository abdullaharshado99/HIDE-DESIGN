import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

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

      try {
        await this.sendWhatsAppNotification(quote);
      } catch (whatsappError: any) {
        console.error('❌ WhatsApp failed (but data saved):', whatsappError.message);
      }

      return quote;
    } catch (dbError: any) {
      console.error('❌ Database Error:', dbError.message);
      console.error(dbError.stack); 
      throw dbError; 
    }
  }

  findAll() { return this.quotes.find({ order: { createdAt: 'DESC' } }); }

  private async sendWhatsAppNotification(quote: Quote): Promise<void> {
    const apiUrl = process.env.WASPHERE_API_URL?.replace(/\/+$/, '');
    const apiKey = process.env.WASPHERE_API_KEY;
    const workspaceId = process.env.WASPHERE_WORKSPACE_ID;
    const sessionId = process.env.WASPHERE_SESSION_ID;
    const recipients = (process.env.QUOTE_WHATSAPP_RECIPIENTS ?? process.env.ADMIN_WHATSAPP_NUMBER ?? '')
      .split(',')
      .map((recipient) => recipient.replace(/\D/g, ''))
      .filter(Boolean);

    if (!apiUrl || !apiKey || !workspaceId || !sessionId || !recipients.length) {
      throw new Error(
        'Missing WASPHERE_API_URL, WASPHERE_API_KEY, WASPHERE_WORKSPACE_ID, WASPHERE_SESSION_ID, or QUOTE_WHATSAPP_RECIPIENTS',
      );
    }

    const endpoint = `${apiUrl}/workspaces/${encodeURIComponent(workspaceId)}/proxy/api/sessions/${encodeURIComponent(sessionId)}/messages/text`;
    const messageBody = [
      'New Quote Request',
      '',
      `Name: ${quote.name}`,
      `Email: ${quote.email}`,
      `Phone: ${quote.phone ?? ''}`,
      `Category: ${quote.category}`,
      `Message: ${quote.message}`,
    ].join('\n');

    await Promise.all(recipients.map(async (recipient) => {
      console.log(`Sending WhatsApp notification to ${recipient} via ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: recipient, text: messageBody }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`WaSphere returned ${response.status} for ${recipient}: ${responseText}`);
      }

      console.log(`✅ WhatsApp notification sent to ${recipient}:`, responseText);
    }));
  }

  private async sendEmailNotification(quote: Quote) {
    const sender = process.env.EMAIL_USER?.trim();
    const password = process.env.EMAIL_PASS?.replace(/\s/g, '');
    const recipients = (process.env.QUOTE_EMAIL_RECIPIENTS ?? process.env.EMAIL_USER ?? '')
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
      subject: `📩 New Quote Request from ${quote.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">New Quote Request</h2>
          <p><strong>Name:</strong> ${quote.name}</p>
          <p><strong>Email:</strong> ${quote.email}</p>
          <p><strong>Phone:</strong> ${quote.phone}</p>
          <p><strong>Interested In:</strong> ${quote.category}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 10px;">${quote.message}</p>
        </div>
      `,
    });
  }

}