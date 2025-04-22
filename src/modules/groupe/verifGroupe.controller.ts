import { Request ,Response} from 'express';
import {  Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body, Query} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest, IResponse } from 'src/common/response.interface';
import { GroupeService } from './groupe.service';
import { GroupeEntity } from 'src/models/groupe.entity';


@Controller("verifGroupe")
export class VerifGroupeController {
  constructor(private readonly groupeService: GroupeService) {} 

  @Get("/isMembre")
  async verif(@Req() req:Request){
  const {userId,groupeId}=req.body;
  const isMembre=await this.groupeService.isMembre(groupeId,userId);
  return isMembre;
}
@Get("/groupes/:id")
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

@Put("/addD")
async addDoc(@Query("docId") docId:string,@Query("groupeId") groupeId:string,@Query("userId") userId:string):Promise<IResponse<GroupeEntity>>
{
const newgroupe=await this.groupeService.addD(groupeId,docId,userId);
return {
 data:newgroupe,
 status:{
 code:200,
 message:`le doc d'id:${docId} est ajoute dans le groupe`
}
}
}


}