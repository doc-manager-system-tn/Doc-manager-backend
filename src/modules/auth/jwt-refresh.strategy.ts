import { Injectable} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { refreshToken } from 'firebase-admin/app';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedRequest } from 'src/common/response.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req:AuthenticatedRequest,payload: any) {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const user={...payload,
      refreshToken:token
    };
    req.user=user
  console.log(user)
    return user;
  }
}
