import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupeService } from './groupe.service';
import { GroupeEntity } from 'src/models/groupe.entity';
import { GroupeController } from './groupe.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
    GroupeEntity
  ]),
],
  controllers: [GroupeController],
  providers: [GroupeService],
})
export class ApplicationModule { }