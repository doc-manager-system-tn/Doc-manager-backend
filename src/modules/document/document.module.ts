import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocEntity } from 'src/models/document.entity';
import { UserEntity } from 'src/models/user.entity';
import { DocController } from './document.controller';
import { DocService } from './document.service';
import { DocUpController } from './updatedoc.controller';
import { StatsService } from '../stats/stats.service';
import { StatsModule } from '../stats/stats.module';
import { VersionService } from '../version/version.service';
import { OpenAIError } from 'openai';
import { OpenRouterController } from './doc.generate.controller';
import { OpenRouterService } from './doc.generate.service';




@Module({
  imports: [
    TypeOrmModule.forFeature([
     DocEntity
  ]),

],
  controllers: [DocController,DocUpController,OpenRouterController],
  providers: [DocService,StatsService,VersionService,OpenRouterService],
})
export class DocModule { }