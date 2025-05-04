import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
     UserEntity
  ]),
],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule { } 