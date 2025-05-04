import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Fonction pour générer un JWT
  async generateTokens(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '45m',  // expiration de 15 minutes pour l'Access Token
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',  // expiration de 7 jours pour le Refresh Token
    });

    // On met à jour le refresh token dans la base de données de l'utilisateur
   await this.usersService.updateRefreshToken(user.id, refreshToken);

    return accessToken;
  }
  async generateTokens1(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '45m',  // expiration de 15 minutes pour l'Access Token
    });

    

    // On met à jour le refresh token dans la base de données de l'utilisateur

    return accessToken;
  }
  // Fonction de login
  async login(email: string, password: string) {
    const user1 =await this.usersService.getUserByEmail(email);
    if (!user1) {
      throw new Error('Invalid credentials E'); 
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password,user1.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials P');
    }

    // Générer les tokens
    const accessToken= await this.generateTokens(user1);
    const user=await this.usersService.getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid new credentials E'); 
    }
    return {
      user,
      accessToken
    }
  }

  // Fonction de rafraîchissement des tokens
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser(userId);
    //   console.log(" user.refreshToken:"+ user.refreshToken+"\n refreshToken:"+refreshToken)
    if (!user || user.refreshToken !== refreshToken) throw new Error("le token ou l'id de user est inccorect")

    const accessToken= await this.generateTokens1(user);//si l'acces token va expire
    return {accessToken} 
  }
}
