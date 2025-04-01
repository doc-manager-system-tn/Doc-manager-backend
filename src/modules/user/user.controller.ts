import { Controller, Get ,Post,Put,Delete,Req, Param} from '@nestjs/common';
import { UserService } from './user.service';
import * as Bcrypt from "bcrypt";
import { Request ,Response} from 'express';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async getmessage(@Param("id") id:string){
    try{
      const user=await this.userService.getUser(id);
      return user;

    }catch(err){
      return err;
    }
   

  }

  @Post()
  async createUser(@Req() req:Request){
   
    try{
  
        const hashpassword =await Bcrypt.hash(req.body.password,10);
      const userExist=await this.userService.verifUserByemail(req.body.email);
      const userObject={
      ... req.body,
      password:hashpassword
      };
      if(userExist){
       const newuser=this.userService.createUser(userObject);
      return newuser;
      }
        return "vous étes deja enregistre";

    
    
    }catch(err){
  return err;
    }
  }

  @Put("/:id")
  async updateUser(@Param("id") id:string,@Req() req:Request){
    try{
      const userData=req.body;
      const newuser=await this.userService.updateUser(id,userData);
       return newuser;

    }catch(err){
      return err;
    }

  }

  @Delete("/:id")
  async deleteUser(@Param("id") id:string){
    try{
     const userD=await this.userService.deleteUser(id);

     return userD;

    }catch(err){
      return err;
    }

  }

 


}