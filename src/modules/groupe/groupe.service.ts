import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeEntity } from 'src/models/groupe.entity';

@Injectable()
export class GroupeService {

  constructor(
    @InjectRepository(GroupeEntity) private readonly groupeRepository: Repository<GroupeEntity>)
    {}


 /*async create(adminId:string,groupe:Partial<GroupeEntity>){
 try{
    const admin=this
const dataGroupe={
    ...groupe,
    admin:{
        id:groupeId
    }
    };
    const newGroupe=this.groupeRepository.create(dataGroupe);
    if(!newGroupe) throw new Error("invalid creation")
      await  this.groupeRepository.save(newGroupe);
     return newGroupe;
 }catch(err){
    throw err;
 }
 }*/


  }