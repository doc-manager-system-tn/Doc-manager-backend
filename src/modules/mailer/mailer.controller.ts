import { Controller, Get, Query, Req } from '@nestjs/common';
import { MailService } from './mailer.service';
import { Request } from 'express';
import { Public } from '../auth/decorateur/public.decorateur';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  
  @Get('send')
  async send(@Req() req:Request) {
    const {to,username, companyName}=req.body;
    await this.mailService.sendEmail(to, username, companyName);
    return { message: 'Email envoyé avec succès' };
  }
}

