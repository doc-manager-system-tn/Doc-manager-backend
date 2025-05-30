import { Request ,Response} from 'express';
import {  Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body, Query} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest, IResponse ,GroupeComplet} from 'src/common/response.interface';
import { GroupeService } from './groupe.service';
import { GroupeEntity } from 'src/models/groupe.entity';
import { UserService } from '../user/user.service';
import { AccessService } from '../access/access.service';
import { Public } from '../auth/decorateur/public.decorateur';


@Controller("verifGroupe")
export class VerifGroupeController {
  constructor(private readonly groupeService: GroupeService,
    private readonly userService:UserService,
    private readonly accessService:AccessService
  ) {} 

  @Post("/isMembre")
  async verif(@Req() req:Request){
  const {userId,groupeId}=req.body;
  const isMembre=await this.groupeService.isMembre(groupeId,userId);
  return isMembre;
}
@Get("/groupes/:id")
async getGroupes(@Param("id") id:string):Promise<IResponse<GroupeEntity>>
{
const groupes=await this.groupeService.getCompanyByadmin(id);
return {
  data:groupes,
  status:{
    code:200,
    message:"les information de cet est bien extracter" 
  },
 
}
}
@Get("/sousGroupes/:id")
async getSousGroupes(@Param("id") id:string):Promise<IResponse<GroupeEntity[]>>
{
const groupes=await this.groupeService.getAllSubGroups(id);
return {
  data:groupes,
  status:{
    code:200,
    message:"les information de cet est bien extracter"
  },
 
}
}
@Get("/groupeComplet/:id")
async getDataGroupeC(@Param("id") id:string):Promise<IResponse<GroupeComplet<GroupeEntity>>>
{
const dataGroupe=await this.groupeService.getGroupesByadmin(id);
return {
  data:dataGroupe,
  status:{
    code:200,
    message:"les information de cet groupe est bien extracter" 
  }
}
}

@Get("/getGroupes/:id")
async getGroupes1(@Param("id") id:string):Promise<IResponse<GroupeEntity>>
{
const groupes=await this.groupeService.getgroupes1Byadmin(id);
return {
  data:groupes,
  status:{
    code:200,
    message:"tous les sous groupes de cet admin est bien retourner"
  }
}

}

@Get("/getAllGbyAdmin/:id")
async getAllgroupes(@Param("id") id:string):Promise<IResponse<GroupeEntity>>
{
const groupes=await this.groupeService.getAllGroupes(id);
return {
  data:groupes,
  status:{
    code:200,
    message:"tous les groupes de cet admin est bien retourner"
  }
}

}

@Put("/addD")
async addDoc(@Req() req:Request):Promise<IResponse<GroupeEntity>>
{
  const {groupeId,userId,docId}=req.body;
const newgroupe=await this.groupeService.addD(groupeId,docId,userId);
return {
 data:newgroupe,
 status:{
 code:200,
 message:`le doc d'id:${docId} est ajoute dans le groupe`
}
}
}
/*
@Public()
@Put("/approvedU")
async appproveU(@Query("adminId") adminId:string,@Query("groupeId") groupeId:string,@Query("userId") userId:string):Promise<IResponse<GroupeEntity>>
{
     await this.accessService.addApproved(groupeId,userId);
     const newgroupe=await this.groupeService.addM(userId,groupeId,adminId);
return {
 data:newgroupe,
 status:{
 code:200,
 message:`cet utlisateur a une access pour le groupe d'id :${groupeId}`
}
}
}*/


}