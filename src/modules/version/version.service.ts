import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionEntity } from 'src/models/version.entity';
import { DocService } from '../document/document.service';
@Injectable()
export class VersionService {

  constructor(
    @InjectRepository(VersionEntity) private readonly versionRepository: Repository<VersionEntity>,
    private readonly docService: DocService

)
    {}

    async createV(url:string,userId:string,docId:string):Promise<VersionEntity>
    {
        try{
           const lastVersion = await this.versionRepository.findOne({
                where: {doc: { id: docId }},
                order: { created_at: 'DESC' }
              });
      
              const lastVersionNumber = lastVersion 
              ? parseInt(lastVersion.nameV.substring(1)) 
              : 0;
            const newVersionNumber = lastVersionNumber + 1;
            const dataV ={
                nameV: `v${newVersionNumber}`,
                path:url,
                doc: {
                    id:docId
                },
                modifier:{
                    id:userId
                }
                }
            const newVersion = this.versionRepository.create(dataV);
            await  this.versionRepository.save(newVersion);
            return newVersion

        }catch(err){
  throw err;
        }
        
    }

}