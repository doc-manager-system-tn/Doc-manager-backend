import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocEntity, DocFormat } from 'src/models/document.entity';
import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import * as Multer from "multer";
import { Express, Response } from 'express';
import * as mime from 'mime-types';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { IDataFile, IResponse } from 'src/common/response.interface';
import { VersionEntity } from 'src/models/version.entity';
import { fileTypeFromBuffer } from 'file-type';
import { StatsService } from '../stats/stats.service';



@Injectable()
export class DocService {

  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private connectionString:string=String(process.env.CONNECTION_STRING);
 private containerName:string=String(process.env.CONTAINER_NAME);


  constructor(
    @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>,
    @InjectRepository(VersionEntity) private readonly versionRepository: Repository<VersionEntity>,
   
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
    
      //onst fileType = require('file-type');
      try {//2 Mo=2048*1024 octet
        if(sizeInBytes<=(2048*1024)){
         /* const fileType = await import('file-type/core');
          const { fileTypeFromBuffer } = fileType;*/
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
     const realname=(file.originalname.split('.'))[0];
       const data={
        path:blockBlobClient.url,
        titre:realname,
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
        const docVersion=await this.versionRepository.findOne({
          where:{id},
          relations:['doc']
        });
        if(!docVersion) throw new Error ("version not found");
        const fileName=(docVersion.path.split("/"))[4];
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      const buffer = await blockBlobClient.downloadToBuffer();
      const format=docVersion.doc?.format;
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
  parseLineToTextRuns(line: string): Paragraph {
        const titleMatch = line.match(/^(h[1-6]):\s*(.*)/);
        if (titleMatch) {
          const level = parseInt(titleMatch[1][1]);
          const text = titleMatch[2];
      
          return new Paragraph({
            children: [
              new TextRun({
                text,
                bold: true,
                size: 48 - (level - 1) * 4, // Taille du texte selon le titre
              }),
            ],
            spacing: { after: 200 },
          });
        }
      
        const parts = line.split(/(\$\$.*?\$\$|\*\*.*?\*\*)/g);
      
        const runs = parts.map(part => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return new TextRun({
              text: part.slice(2, -2),
              color: '00AA00', // vert
            });
          } else if (part.startsWith('**') && part.endsWith('**')) {
            return new TextRun({
              text: part.slice(2, -2),
              color: 'FF0000', // rouge
              bold: true,
            });
          } else {
            return new TextRun({ text: part });
          }
        });
      
        return new Paragraph({ children: runs });
      }
     async  generateVirtualFile( content: string,format:string,name:string): Promise<Express.Multer.File>
      {
       
        /*let buffer: Buffer;
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
       }*/
  let buffer: Buffer;
  let mimeType: string;

  try {
    if (format === 'txt') {
      buffer = Buffer.from(content, 'utf-8');
      mimeType = 'text/plain';
    } else if (format === 'docx') {
      const doc = new Document({
        sections: [
          {
            children: content.split('\n').map(line => this.parseLineToTextRuns(line)),
          },
        ],
      });

      buffer = await Packer.toBuffer(doc);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      throw new Error('Format non supporté');
    }

    const fileName = `${name}.${format}`;

    const virtualFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: fileName,
      encoding: '7bit',
      mimetype: mimeType,
      size: buffer.length,
      buffer,
      stream: null as any,
      destination: '',
      filename: fileName,
      path: '',
    };

    return virtualFile;
  } catch (err) {
    throw err;
  }
      
        
      }
     /* async incNbUse(docId:string):Promise<void>
      {
        try{
          const doc=await this.docRepository.findOne({
            where:{id:docId}
          });
          if(!doc) throw new Error("erreur dans l'extraction sur le processsus de inc");

          const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Vérifier si une entrée existe pour aujourd'hui
    let dailyStat = doc.stats?.find((stat)=>stat.date===today);

    if (dailyStat) {
      // Si une entrée existe pour aujourd'hui, incrémenter nb_use
      dailyStat.nb_use += 1;
    } else {
      // Sinon, ajouter une nouvelle entrée pour aujourd'hui
      doc.stats.push({ date: today, nb_use: 1 });
    }
   await  this.docRepository.save(doc);
        }catch(err){
          throw err;
        }
      
      }*/

     


}
