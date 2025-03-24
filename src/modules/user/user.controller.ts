import { Controller, Get ,Post,Put,Delete,Req} from '@nestjs/common';
import { UserService } from './user.service';
import * as Bcrypt from "bcrypt";
import { Request } from 'express';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getmessage(){
    return "hello";
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

 


}