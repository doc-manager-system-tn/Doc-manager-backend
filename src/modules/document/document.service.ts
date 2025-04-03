import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocEntity } from 'src/models/document.entity';
import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import * as Multer from "multer";
import { Express, Response } from 'express';
import * as mime from 'mime-types';
import { fileTypeFromBuffer } from 'file-type';


@Injectable()
export class DocService {

  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private connectionString:string=String(process.env.CONNECTION_STRING);
 private containerName:string=String(process.env.CONTAINER_NAME);


  constructor(
    @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>
  )
    {
      this.blobServiceClient=BlobServiceClient.fromConnectionString(this.connectionString);
      this.containerClient=this.blobServiceClient.getContainerClient(this.containerName);

    }


    async ulploadFile(file:Express.Multer.File){

      const types=["doc","pdf","txt","docx"];
     const fileName = `${Date.now()}_${file.originalname}`;
      const buffer = file.buffer; // Contenu du fichier téléchargé
     
    
  
      try {
        const contentType = mime.lookup(file.originalname) || 'application/octet-stream';
        let fileTypeResult = await fileTypeFromBuffer(buffer);
      let format = fileTypeResult ? fileTypeResult.ext : mime.extension(mime.lookup(file.originalname) || '');

        if(!types.includes(format)){
        format=null;
        }



        const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
     
        
        await blockBlobClient.upload(buffer, buffer.length, {
          blobHTTPHeaders: {
            blobContentType: contentType, // Ajout du type MIME ici
          },
        });
  
       const data={
        path:blockBlobClient.url,
        titre:fileName,
        format
        
       }
        
        
        return data; 
      } catch (err) {
        return err;
      }
  
    }

    async getFile(id:string){
     /* const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    return blockBlobClient.url;*/
    try{
      const doc =await this.docRepository.findOne(
        {
          where:{id}
        }
      );
      return doc;
    }catch(err){
      return err;
    }
    

    }

    async createDoc(doc:Partial<DocEntity>,userId:string){
     const docComplet={
      ...doc,
      creator:{
        id:userId
      }
     };
     try{
      const newDoc=this.docRepository.create(docComplet);

      await this.docRepository.save(newDoc);
      return newDoc
     }catch(err){
      return err;
     }
      
    }

 
    async downloadFile(id:string,res:Response){

       try{ 
  const doc=await this.docRepository.findOne({
        where:{id}
      });
      if(doc){
        const fileName=doc.titre;
        const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
        
      
        const downloadResponse = await blockBlobClient.download();
        return {
          stream: downloadResponse.readableStreamBody,
          fileName
        }
      }else{
        return null;
      }
      
}catch(err){
 return err;
}
      
    }
    


}
