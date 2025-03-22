import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConnectionConfiguration } from '../../common/data-source';
import { UserEntity } from 'src/models/user.entity';
import { GroupeEntity } from 'src/models/groupe.entity';
import { WebHookEntity } from 'src/models/webhook.entity';
import { DocEntity } from 'src/models/document.entity';
import { CategorieEntity } from 'src/models/categorie.entity';
import { FeedBackEntity } from 'src/models/feedback.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(ConnectionConfiguration),
    TypeOrmModule.forFeature([
      UserEntity,
      GroupeEntity,
      WebHookEntity,
      DocEntity,
      CategorieEntity,
      FeedBackEntity
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
