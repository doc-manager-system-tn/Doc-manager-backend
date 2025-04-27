import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupeService } from './groupe.service';
import { GroupeEntity } from 'src/models/groupe.entity';
import { GroupeController } from './groupe.controller';
import { VerifGroupeController } from './verifGroupe.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
    GroupeEntity
  ]),
],
  controllers: [GroupeController,VerifGroupeController],
  providers: [GroupeService],
})
export class GroupeModule { }