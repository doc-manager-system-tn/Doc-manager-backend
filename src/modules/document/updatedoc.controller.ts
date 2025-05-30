import { Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body} from '@nestjs/common';
import { DocService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express';
import {IResponse} from "../../common/response.interface";
import { DocEntity } from 'src/models/document.entity';
import { VersionService } from '../version/version.service'; 
import { VersionEntity } from 'src/models/version.entity';
import { StatsService } from '../stats/stats.service';
import { Public } from '../auth/decorateur/public.decorateur';
import { WebhookEvent } from 'src/models/webhook.entity';
import { WebHookService } from '../webhook/webhook.service';

@Controller("updateDoc")
export class DocUpController {
  constructor(private readonly docService: DocService,
    private readonly versionService: VersionService,
    private readonly statsService:StatsService,
     private readonly webhookService:WebHookService
  ) {}



  @Get("/:id")
  async getContentText(@Param("id") id:string):Promise<IResponse<string>>
  {
   const textDoc=await  this.docService.getContentDocument(id);
   const version=await this.versionService.getV(id);
   await this.statsService.updateUsageStats(version.doc?.id);
   return {
    data:textDoc,
    status:{
      code:200,
      message:"le contenu de document est envoyé avec succés"
    }
   };
  }
@Get("/docsBycreator/:id")
async getDocsByCreator(@Param("id") id:string):Promise<IResponse<DocEntity>>
{
const docs=await this.docService.getDocsBycreator(id);
return {
  data:docs,
  status:{
    code:200,
    message:"les docs est bien extractes"
  }
}

}

@Get("/docsByMandCr/:id")
async getDocsByUser(@Param("id") id:string):Promise<IResponse<DocEntity>>
{
const docs=await this.docService.findDocsForUser(id);
return {
  data:docs,
  status:{
    code:200,
    message:"les docs est bien extractes"
  }
}


}

  @Post("/:id")
async createVFile(@Req() req:Request,@Param("id") id:string):Promise<IResponse</*Partial<DocEntity>*/VersionEntity>>
{
  const {format,content,filename,modifier_id}=req.body;
  const file=await this.docService.generateVirtualFile(content,format,filename); 
 const datafile=await this.docService.ulploadFile(file);
 const newversion=await this.versionService.createV(datafile.path,modifier_id,id);
 await this.webhookService.triggerEvent(WebhookEvent.DOCUMENT_UPDATED,id);//webhook
  return {
    data:newversion, 
    status:{code:201,
      message:"le document est crée avec sucess"  
    }
  }

 }




}