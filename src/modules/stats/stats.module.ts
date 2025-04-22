import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsEntity } from 'src/models/stats.entity';
import { StatsService } from './stats.service';
import { DocService } from '../document/document.service';
import { DocModule } from '../document/document.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
  StatsEntity
  ]),
 
],
  controllers: [StatsController],
  providers: [StatsService,DocService],
})
export class StatsModule { }