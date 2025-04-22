import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import {IResponse} from "../../common/response.interface";
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/response.interface';
import { Public } from './decorateur/public.decorateur';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
@Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }):Promise<IResponse<any>>
   {
    const user = await this.authService.login(body.email, body.password);
   
    return {
      data:user,
      status:{code:201,
        message:"vous étes connecter"
      }
    };
  }
@Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return await this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
