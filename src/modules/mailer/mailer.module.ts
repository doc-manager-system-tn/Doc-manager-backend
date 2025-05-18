import { Module } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { MailController } from './mailer.controller';

@Module({
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}



