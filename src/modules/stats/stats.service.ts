import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsEntity } from 'src/models/stats.entity';
import { DocEntity } from 'src/models/document.entity';
import { DocService } from '../document/document.service';
import { stripTypeScriptTypes } from 'module';



export class StatsService {

    constructor(  @InjectRepository(StatsEntity) private readonly statsRepository: Repository<StatsEntity>,
   @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>
){}

async getStatsForLastPeriod(docId: string,nbP:number) {
   try{
    const today = new Date();
    const lastday = new Date();
    lastday.setDate(today.getDate() -nbP); 
 // const doc=await this.docService.getFile(docId);
  return this.statsRepository.find({
    where:{
        doc:{id:docId},
        createdAt:Between(lastday,today),
    },
    order: {
        createdAt: 'ASC',
      },
      relations:['doc']
    
       })
   }catch(err){
throw err;
   }
    
  }

    async updateUsageStats(documentId: string): Promise<void> {
        try{
            const document = await this.docRepository.findOne({
                where: { id: documentId },
                relations: ['stats'],
              });
            
              if (!document) throw new Error('Document non trouvé');
            
              const today = new Date().toISOString().split('T')[0];
              const stat = document.stats.find((s) => {
                const date = s.createdAt.toISOString().split('T')[0];
                return date === today;
              });
              if (!stat) {
                 const stat1 = this.statsRepository.create({ createdAt: new Date(), nb_use: 1,doc:document })
                 await this.statsRepository.save(stat1);
              }else{
               stat.nb_use++;
               await this.statsRepository.save(stat);
              }
            
              
        }catch(err){
            throw err;
        }
        
      }
      async verifD(documentId: string) {
        try{
            const document = await this.docRepository.findOne({
                where: { id: documentId },
                relations: ['stats'],
              });
            
              if (!document) throw new Error('Document non trouvé');
            
              const today = new Date().toISOString().split('T')[0];
            let i:number=0;
              /*let stat =document?.stats.find((s) =>{
                  const date=s.createdAt.toISOString().split(" ")[0];
                      
              });*/
              const stat=document?.stats[0];
              const date=stat.createdAt.toISOString().split("T")[0];
        return today;
            
              
        }catch(err){
            throw err;
        }
        
      }

}