import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
        secret: process.env.JWT_ACCESS_SECRET,  // Secret pour l'Access Token JWT_ACCESS_SECRET
        signOptions: { expiresIn: '15m' },     // Validité de 15 minutes
      }),
      JwtModule.register({
        secret: process.env.JWT_REFRESH_SECRET,  // Secret pour le Refresh Token
        signOptions: { expiresIn: '7d' },      // Validité de 7 jours
      }),
      
     
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,JwtRefreshStrategy,UserService],
})
export class AuthModule {}
