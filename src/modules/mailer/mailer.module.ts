/*import { Module ,DynamicModule} from '@nestjs/common';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mailer.service';
import { join } from 'path';
import { MailerController } from './mailer.controller';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

@Module({})
export class MailerConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: MailerConfigModule,
      imports: [
        ConfigModule.forRoot(), // pour lire .env
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService): Promise<MailerOptions> => ({
            transport: {
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: "mohamedazizwerhani@gmail.com",
                pass: "1234",
              },
            },
            defaults: {
              from: `"No Reply" <mohamedazizwerhani@gmail.com>`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers:[MailerController],
      providers:[MailService,MailerService]
    };
  }
}*/