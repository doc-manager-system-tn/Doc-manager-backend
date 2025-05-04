import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import {IResponse} from "../../common/response.interface";
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/response.interface';
import { Public } from './decorateur/public.decorateur';
import { AccessService } from '../access/access.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
     private readonly accessService:AccessService
  ) {}
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
  @Post('loginEmploye')
  async loginE(@Req() req:Request):Promise<IResponse<any>>
   {
    try{
      const {email,password,nameG}=req.body;
const access=await this.accessService.getAccess(nameG,email);
if(!access) throw new Error("vous n'avez un access");
    const user = await this.authService.login(email,password);

    return {
      data:user,
      status:{code:201,
        message:"vous étes connecter"
      }

    };
  
  }catch(err){
      throw err
    }
    
  }
@Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return await this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
