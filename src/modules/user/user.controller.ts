import { Controller, Get ,Post,Put,Delete,Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import * as Bcrypt from "bcrypt";
import { Request ,Response} from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest,IResponse } from 'src/common/response.interface';
import { UserEntity } from 'src/models/user.entity';
import { DeleteResult } from 'typeorm';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

@UseGuards(JwtAccessGuard)
  @Get("userByid")
  async getmessage(@Req() req:AuthenticatedRequest):Promise<IResponse<UserEntity>>
  {
    try{
      const id=req.user.sub;
      const user=await this.userService.getUser(id);
      return {
        data:user,
        status:{code:200,
        message:"vous avez extracter les infos avec succes"
        }
      }

    }catch(err){
      throw err;
    }
   

  }

  @Post()
  async createUser(@Req() req:Request):Promise<IResponse<UserEntity>>
  {
    const hashpassword =await Bcrypt.hash(req.body.password,10);
      const userExist=await this.userService.verifUserByemail(req.body.email);
      const userObject={
      ... req.body,
      password:hashpassword
      };
      if(!userExist){
        throw new Error("vous étes deja enregistre");
      }
      const newuser=this.userService.createUser(userObject);
      return {
        data:userObject,
        status:{code:201,
          message:"l'utilisateur est crée avec succes"
        }
      };
      
  }

  @Put("/:id")
  async updateUser(@Param("id") id:string,@Req() req:Request):Promise<IResponse<any>>
  {
    try{
      const userData=req.body;
      const newuser=await this.userService.updateUser(id,userData);
       return {
        data:newuser,
        status:{code:200,
          message:"le user est modifié avec succes"
        }
       };

    }catch(err){
      throw err;
    }

  }

  @Delete("/:id")
  async deleteUser(@Param("id") id:string):Promise<IResponse<DeleteResult>>
  {
     const userD=await this.userService.deleteUser(id);
     return {
      data:userD,
      status:{
        code:200,
        message:"la supperssion a était effectuer"
      }
     };
  }

 


}