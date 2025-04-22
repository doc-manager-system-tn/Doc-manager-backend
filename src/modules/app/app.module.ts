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
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { DocController } from '../document/document.controller';
import { DocService } from '../document/document.service';
import { CategorieController } from '../categorie/categorie.controller';
import { CategorieService } from '../categorie/categorie.service';
import { VersionEntity } from 'src/models/version.entity';
import { DocUpController } from '../document/updatedoc.controller';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtRefreshStrategy } from '../auth/jwt-refresh.strategy';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { VersionController } from '../version/version.controlller';
import { GroupeController } from '../groupe/groupe.controller';
import { VersionService } from '../version/version.service';
import { GroupeService } from '../groupe/groupe.service';
import { VerifGroupeController } from '../groupe/verifGroupe.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { FeedbackService } from '../feedback/feedback.service';
import { FeedbackController } from '../feedback/feedback.controller';
import { SocketGateway } from '../scoket/socket.getway';
import { FirebaseService } from '../scoket/firebase/firebase.service';
import { StatsEntity } from 'src/models/stats.entity';
import { StatsController } from '../stats/stats.controller';
import { StatsService } from '../stats/stats.service';
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
      FeedBackEntity,
      VersionEntity,
      FeedBackEntity,
      StatsEntity
    ]),
 
  ],
  controllers: [AppController,UserController,DocController,CategorieController,DocUpController,AuthController,VersionController,GroupeController,VerifGroupeController,FeedbackController,StatsController],
  providers: [AppService,UserService,DocService,CategorieService,AuthService,JwtRefreshStrategy,JwtStrategy,JwtService,VersionService,GroupeService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },FeedbackService,SocketGateway, FirebaseService,StatsService
  ],

})
export class AppModule {}
