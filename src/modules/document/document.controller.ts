import { Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile} from '@nestjs/common';
import { DocService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express';

@Controller("doc")
export class DocController {
  constructor(private readonly userService: DocService) {}


@Post("/:id")
@UseInterceptors(FileInterceptor("file"))
async uploadDocument(@UploadedFile() file:Express.Multer.File,@Req() req:Request,@Param("id") id:string){

  const fileUrl=await this.userService.ulploadFile(file);
  const newDocument=this.userService.createDoc(req.body,fileUrl,id);

  return newDocument;
}  









}