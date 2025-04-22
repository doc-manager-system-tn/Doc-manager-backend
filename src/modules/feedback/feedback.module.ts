import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackEntity } from 'src/models/feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
     FeedBackEntity
  ]),
],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class UserModule { }