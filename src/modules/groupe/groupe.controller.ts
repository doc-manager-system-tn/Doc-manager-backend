import { Request ,Response} from 'express';
import {  Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body, Query} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest, IResponse } from 'src/common/response.interface';
import { GroupeService } from './groupe.service';
import { GroupeEntity } from 'src/models/groupe.entity';


@Controller("groupe")
export class GroupeController {
  constructor(private readonly groupeService: GroupeService) {} 

@Post("/:id")
async createGroupe(@Req() req:Request,@Param("id") adminId:string):Promise<IResponse<GroupeEntity>>
{
 const dataGroupe:GroupeEntity=req.body;
 const newGroupe=await this.groupeService.create(adminId,dataGroupe,null);
 return {
  data:newGroupe,
  status:{
    code:201,
    message:"le groupe est crée avec succés"
  }
 }
}

@Post("/childGroupe/:id")
async createChildGroupe(@Req() req:Request,@Param("id") parentGroupeId:string):Promise<IResponse<GroupeEntity>>
{
const dataGroupe=req.body;
const parentGroupe=await this.groupeService.getGroupe(parentGroupeId);
const adminId=parentGroupe.admin.id;
const childGroupe=await this.groupeService.create(adminId,dataGroupe,parentGroupeId);
return {
  data:childGroupe,
  status:{
    code:200,
    message:"le child groupe est crée avec succés"
  }
};

}
@Get("/:id")
async getGroupe(@Param("id") id:string):Promise<IResponse<GroupeEntity>>
{
const groupe=await this.groupeService.getGroupe(id); 
return {
  data:groupe,
  status:{
    code:200,
    message:"les information de cet est bien extracter" 
  }
}
}
@Get("groupes/:id")
async getGroupes(@Param("id") id:string):Promise<IResponse<GroupeEntity>>
{
const groupes=await this.groupeService.getGroupeByadmin(id);
return {
  data:groupes,
  status:{
    code:200,
    message:"les information de cet est bien extracter" 
  }
}
}



@Put("/addM")
async addMembre(@Query("userId") userId:string,@Query("groupeId") groupeId:string,@Query("adminId") adminId:string):Promise<IResponse<GroupeEntity>>
{
const newgroupe=await this.groupeService.addM(userId,groupeId,adminId);
return {
 data:newgroupe,
 status:{
 code:200,
 message:`le user d'id:${userId} est ajoute dans le groupe`
}
}
}



}