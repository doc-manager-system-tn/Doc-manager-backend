import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieEntity } from 'src/models/categorie.entity';
import { CategorieController } from './categorie.controller';
import { CategorieService } from './categorie.service';




@Module({
  imports: [
    TypeOrmModule.forFeature([
        CategorieEntity
  ]),
],
  controllers: [CategorieController],
  providers: [CategorieService],
})
export class ApplicationModule { }