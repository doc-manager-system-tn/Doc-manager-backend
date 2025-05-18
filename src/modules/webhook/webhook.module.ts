import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebHookEntity } from 'src/models/webhook.entity';
import { WebHookService } from './webhook.service';
import { WebHookController } from './webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
   WebHookEntity
  ]),
],
  controllers: [WebHookController],
  providers: [WebHookService],
})
export class WebHookModule { }