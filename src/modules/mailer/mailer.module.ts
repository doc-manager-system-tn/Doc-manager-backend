/*import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mailer.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com', // Remplacez par votre hôte SMTP (ex. Gmail, SendGrid)
        port: 587,
        secure: false, // true pour 465, false pour autres ports
        auth: {
          user: 'mohamedazizwerhani@gmail.com', // Votre adresse e-mail
          pass: 'aziz12345678', // Votre mot de passe ou clé API
        },
      },
      defaults: {
        from: '"No Reply" <mohamedazizwerhani@gmail.com>', // Expéditeur par défaut
      },
      template: {
        dir: join(__dirname, 'templates'), // Dossier des templates
        adapter: new HandlebarsAdapter(), // Adaptateur pour Handlebars
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Exporter le service pour l'utiliser ailleurs
})
export class MailModule {}*/