import { Controller, Get ,Post,Put,Delete,Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import * as Bcrypt from "bcrypt";
import { Request ,Response} from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest,IResponse } from 'src/common/response.interface';
import { UserEntity, UserRole } from 'src/models/user.entity';
import { DeleteResult } from 'typeorm';
import { Public } from '../auth/decorateur/public.decorateur';
import { GroupeService } from '../groupe/groupe.service';
import { AccessService } from '../access/access.service';
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly groupeService:GroupeService,
    private readonly accessService:AccessService,
  ) {}

/*@UseGuards(JwtAccessGuard)
  */
 @Get("/:id")
  async getmessage(@Param("id") id:string):Promise<IResponse<UserEntity>>
  {
    try{
      const user=await this.userService.getUser1(id);
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
@Public()
  @Post()
  async createUser(@Req() req:Request):Promise<IResponse<UserEntity>>
  {
    const hashpassword =await Bcrypt.hash(req.body.password,10);
      const userExist=await this.userService.verifUserByemail(req.body.email);
      const {username,email,role,groupeName}=req.body;
      let newuser1:UserEntity;
      const userObject={
      username,
      password:hashpassword,
      role,
      email
      };
    
      if(!userExist){
        if(role===UserRole.ADMIN){
          throw new Error("vous étes deja enregistre");
        }else{
          newuser1=await this.userService.getUserByEmail(req.body.email);
          await this.accessService.createAccess(groupeName,newuser1.id);
          return {
            data:newuser1,
            status:{code:201,
              message:"l'utilisateur est crée avec succes"
            }
          };
        }
       
      }else{
      
        newuser1=await this.userService.createUser(userObject);
        if(role===UserRole.EMPOLYE){
          await this.accessService.createAccess(groupeName,newuser1.id);
        }
        return {
          data:newuser1,
          status:{code:201,
            message:"l'utilisateur est crée avec succes"
          }
        };
      }
      
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