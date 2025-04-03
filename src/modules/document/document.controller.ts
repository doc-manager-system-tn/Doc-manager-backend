import { Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res} from '@nestjs/common';
import { DocService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express';

@Controller("doc")
export class DocController {
  constructor(private readonly docService: DocService) {}


@Post("/:id")
@UseInterceptors(FileInterceptor("file"))
async uploadDocument(@UploadedFile() file:Express.Multer.File,@Req() req:Request,@Param("id") id:string){

  const dataFile=await this.docService.ulploadFile(file);
  const newDocument=this.docService.createDoc(dataFile,id);

  return newDocument;
} 
@Get("download/:id")
async downloadDoc(@Param("id") id:string,@Res() res:Response){

 const resultas= await this.docService.downloadFile(id,res);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${resultas?.fileName}`);
        resultas.stream?.pipe(res);
        resultas.stream?.on('end', () => {
          console.log('Le fichier a été téléchargé avec succès.');
        });
  // `le document d'id :${id} est bien telechargé`;

}

@Get("/:id")
async getDoc(@Param("id") id:string){
const doc=await this.docService.getFile(id);
return doc ;

}









}