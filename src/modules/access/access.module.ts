import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessEntity } from 'src/models/access.entity';
import { AccessService } from './access.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
    AccessEntity
  ]),
],
  controllers: [],
  providers: [AccessService],
})
export class AccessModule { }