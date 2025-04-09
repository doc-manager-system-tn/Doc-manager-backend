import { Controller, Get ,Post,Put,Delete,Req, Param,UseInterceptors, UploadedFile,Res,Body} from '@nestjs/common';
import { DocService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express';
import {IDataFile, IResponse} from "../../common/response.interface";
import { DocEntity } from 'src/models/document.entity';
import { VersionService } from '../version/version.service';

@Controller("doc")
export class DocController {
  constructor(private readonly docService: DocService,
    private readonly versionService: VersionService
  ) {}

  

@Post("/:id")
@UseInterceptors(FileInterceptor("file"))
async uploadDocument(@UploadedFile() file:Express.Multer.File,@Req() req:Request,@Param("id") id:string):Promise<IResponse<DocEntity>>
{
 
  const dataFile:IDataFile=await this.docService.ulploadFile(file);
  const dataDoc:Partial<DocEntity>={format:dataFile.format,titre:dataFile.titre}
  const newDocument=await this.docService.createDoc(dataDoc,id);
  const newversion=this.versionService.createV(dataFile.path,id,newDocument.id);
  return {data:newDocument,
     status:{code:201,
      message:"le document est crée avec succés"
     }
  };
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
async getDoc(@Param("id") id:string):Promise<IResponse<DocEntity>>
{
   const doc=await this.docService.getFile(id);
   return {
  data:doc,
  status:{
    code:200,
    message:`les information du document d'id:${id} est bien recu`
  }
};

}

/**/
 



  }













