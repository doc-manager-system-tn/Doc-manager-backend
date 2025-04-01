import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocEntity } from 'src/models/document.entity';
import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import * as Multer from "multer"
import { Express } from 'express';
import * as mime from 'mime-types';


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

      
     const fileName = `${Date.now()}_${file.originalname}`;
      const buffer = file.buffer; // Contenu du fichier téléchargé
      const contentType = mime.lookup(file.originalname) || 'application/octet-stream';
  
      try {
        
        const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
  
        
        await blockBlobClient.upload(buffer, buffer.length, {
          blobHTTPHeaders: {
            blobContentType: contentType, // Ajout du type MIME ici
          },
        });
  
       
        
        
        return blockBlobClient.url; 
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

    async createDoc(doc:Partial<DocEntity>,url:string,userId:string){
     const docComplet={
      ...doc,
      path:url,
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
    


}
