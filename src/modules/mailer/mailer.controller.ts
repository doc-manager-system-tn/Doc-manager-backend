/*import { Controller, Get } from '@nestjs/common';
import { MailService } from './mailer.service'

@Controller('test')
export class MailerController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-email')
  async sendTestEmail() {
    await this.mailService.sendMail(
      'mohamedazizwerhani@gmail.com',
      'Bienvenue chez nous',
      'welcome',
      { name: 'Utilisateur Test' },
    );
    return 'E-mail envoyé !';
  }
}*/