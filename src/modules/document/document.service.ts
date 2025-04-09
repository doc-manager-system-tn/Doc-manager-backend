import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocEntity, DocFormat } from 'src/models/document.entity';
import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import * as Multer from "multer";
import { Express, Response } from 'express';
import * as mime from 'mime-types';
import { fileTypeFromBuffer } from 'file-type';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { IDataFile, IResponse } from 'src/common/response.interface';
import { VersionEntity } from 'src/models/version.entity';




@Injectable()
export class DocService {

  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private connectionString:string=String(process.env.CONNECTION_STRING);
 private containerName:string=String(process.env.CONTAINER_NAME);


  constructor(
    @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>,
    @InjectRepository(VersionEntity) private readonly versionRepository: Repository<VersionEntity>
  )
    {
      this.blobServiceClient=BlobServiceClient.fromConnectionString(this.connectionString);
      this.containerClient=this.blobServiceClient.getContainerClient(this.containerName);

    }


   async ulploadFile(file:Express.Multer.File):Promise<IDataFile>
   {

      const types=["doc","pdf","txt","docx"];
     const fileName :string = `${Date.now()}_${file.originalname}`;
      const buffer = file.buffer; // Contenu du fichier téléchargé
      const sizeInBytes = buffer.length;
    
  
      try {//2 Mo=2048*1024 octet
        if(sizeInBytes<=(2048*1024)){

          const contentType = mime.lookup(file.originalname) || 'application/octet-stream';
        let fileTypeResult = await fileTypeFromBuffer(buffer);
      let format= fileTypeResult ? fileTypeResult.ext : mime.extension(mime.lookup(file.originalname) || '');

        if(!Object.values(DocFormat).includes(format as DocFormat)){
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
        titre:file.originalname,
        format
        
       }
        
        
        return data;
        }else{
          throw new Error("la taille de document est depassé la taille limite(2Mo)"); 
        }
         
      } catch (err) {
        throw new Error(err)
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
      if(!doc){
          throw new NotFoundException(`Doc with ID ${id} not found`); 
      }
      return doc;
    }catch(err){
      throw new Error("Erreur lors de l'extraction du document");
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
      const newDoc:DocEntity= this.docRepository.create(docComplet);

      await this.docRepository.save(newDoc);
      return newDoc
     }catch(err){
      throw new Error("Erreur lors de la création du document");
     }
      
    }

 async downloadFile(id:string,res:Response){

       try{ 
  const docVersion=await this.versionRepository.findOne({
    where:{id}
  });


      if(docVersion){
        const fileName=(docVersion.path.split("/"))[4];
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

    async getbufferAndF(id:string){
      try{
        const doc=await this.getFile(id);
      const blockBlobClient = this.containerClient.getBlockBlobClient(doc.titre);
      const buffer = await blockBlobClient.downloadToBuffer();
      const format=doc.format;
      const data={
        buffer,
        format
      };
      return data
      }catch(err){
        throw err;
      }
      
    }

    async getContentDocument(id:string){
  try{
    const data=await this.getbufferAndF(id);
      if(data.buffer){
        if(data.format==="txt"){
          return data.buffer.toString('utf-8');
        }else if(data.format==="docx"){
          const buffer=data.buffer;
          const { value: text } = await mammoth.extractRawText({buffer});
          return text;
        }else{
          throw new Error('Format non supporté');
        }
      }
  }catch(err){
    throw new Error(err);
  }
    
    }

   
   /* async updateContentDocument(id:string,text:string){
      try{
        const doc=await this.getFile(id);
        if(doc){

        }

      }catch(err){
        throw new Error("le mis a jour du contenu de document n'effectue pas");
      }
    
    
    }*/
     async  generateVirtualFile( content: string,format:string,name:string): Promise<Express.Multer.File>
      {
       
        let buffer: Buffer;
        let mimeType: string;
       try{
        if (format === 'txt') {
          buffer = Buffer.from(content, 'utf-8'); 
          mimeType = 'text/plain';
        } else if (format === 'docx') {
          const doc = new Document({
            sections: [
              {
                children: content.split('\n').map(line => new Paragraph({
                  children: [new TextRun(line)],
                })),
              },
            ],
          });
          buffer = await Packer.toBuffer(doc);
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else {
          throw new Error('Format non supporté');
        }
      const fileName=`${name}.${format}`;

       const virtualFile: Express.Multer.File = {
          fieldname: 'file',
          originalname: fileName,
          encoding: '7bit',
          mimetype: mimeType,
          size: buffer.length,
          buffer: buffer,
          stream: null as any,
          destination: '',
          filename: fileName,
          path: '',
        };
      
        return virtualFile;
     
       }catch(err){
  throw err;
       }
      
        
      }

     


}
