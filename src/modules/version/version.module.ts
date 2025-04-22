import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionEntity } from 'src/models/version.entity';
import { VersionService } from './version.service';
import { VersionController } from './version.controlller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
   VersionEntity
  ]),
],
  controllers: [VersionController],
  providers: [VersionController],
})
export class ApplicationModule { }