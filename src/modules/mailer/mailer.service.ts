/*import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template, // Nom du fichier de template sans l'extension (ex. 'welcome')
        context, // Variables à passer au template
      });
      console.log(`E-mail envoyé à ${to}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      throw error;
    }
  }
}*/

