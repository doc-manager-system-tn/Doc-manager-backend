import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocEntity } from 'src/models/document.entity';
import { UserEntity } from 'src/models/user.entity';
import { DocController } from './document.controller';
import { DocService } from './document.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([
     DocEntity
  ]),
],
  controllers: [DocController],
  providers: [DocService],
})
export class UserModule { }