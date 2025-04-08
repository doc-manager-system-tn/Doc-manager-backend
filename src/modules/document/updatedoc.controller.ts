import { Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body} from '@nestjs/common';
import { DocService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express';
import {IResponse} from "../../common/response.interface";
import { DocEntity } from 'src/models/document.entity';

@Controller("updateDoc")
export class DocUpController {
  constructor(private readonly docService: DocService) {}



  @Get("/:id")
  async getContentText(@Param("id") id:string):Promise<IResponse<string>>
  {
   const textDoc=await  this.docService.getContentDocument(id);
   return {
    data:textDoc,
    status:{
      code:200,
      message:"le contenu de document est envoyé avec succés"
    }
   };
  }

  @Post()
async createFile(@Req() req:Request):Promise<IResponse</*Partial<DocEntity>*/any>>
{
  const {format,content,filename}=req.body;
  const file=await this.docService.generateVirtualFile(content,format,filename); 
 const datafile=await this.docService.ulploadFile(file);
  return {
    data:datafile,
    status:{code:201,
      message:"le document est crée avec sucess" 
    }
  }

 }




}