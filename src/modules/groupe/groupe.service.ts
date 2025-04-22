import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeEntity } from 'src/models/groupe.entity';
import { UserService } from '../user/user.service';
import { DocService } from '../document/document.service';
import { UserEntity } from 'src/models/user.entity';

@Injectable()
export class GroupeService {

  constructor(
    @InjectRepository(GroupeEntity) private readonly groupeRepository: Repository<GroupeEntity>,
    private readonly userService: UserService,
    private readonly docservice:DocService
  )
    {}


 async create(adminId:string,groupe:GroupeEntity,groupeId:string|null):Promise<GroupeEntity>
 {
 try{
    const admin=await this.userService.getUser(adminId);
    const role=admin.role;
    if(role==="ADMIN"){
      const dataGroupe={
        ...groupe,
     groupe_racine_id:groupeId,
     admin:{id:adminId}
      }
        const newGroupe=this.groupeRepository.create(dataGroupe);
        if(!newGroupe) throw new Error("invalid creation")
          await  this.groupeRepository.save(newGroupe);
         return newGroupe;
    }else{
      throw new Error("cet utilisateur n'a pas le droit de crée un groupe");
    }

 }catch(err){
    throw err;
 }
 }

 async getGroupe(id:string){
  try{
    const groupe=await this.groupeRepository.findOne({
      where:{id:id}, relations: ['admin','members','docs','pendingUser'], 
    });
    console.log("groupe :"+groupe);
    if(!groupe){
      throw new Error("groupe not found");
      }
      return groupe;
  }catch(err){
   throw err;
  }
  
 }

 async addM(userId:string,groupeId:string,adminId:string)
 {
try{
  const groupe=await this.getGroupe(groupeId);
  const user=await this.userService.getUser(userId);
  //gere le pending
  if((groupe&&user)&&(groupe.admin.id===adminId)/*&&groupe.groupe_racine_id!==null*/){
    let currentGroup = groupe;

    do {
      const alreadyMember = currentGroup.members?.some(member => member.id === user.id);
      if (!alreadyMember) {
        currentGroup.members.push(user);
        await this.groupeRepository.save(currentGroup);
      }

      if (currentGroup.groupe_racine_id) {
        const parentGroup = await this.getGroupe(currentGroup.groupe_racine_id);
        if (!parentGroup) break;
        currentGroup = parentGroup;
      } else {
        break;
      }
    } while (true);
   
    return groupe; 
  }else{
    throw new Error("groupe not found or user not found or vous n'étes pas un amdin de ce groupe !ou ");
  }
}catch(err){
throw err;
}
 }

 async isMembre(groupeId:string,userId:string):Promise<boolean>
{
  try{
    let i:number=0;
    const groupe=await this.groupeRepository.findOne({
      where:{id:groupeId}, relations: ['members'], 
    });
   
    if(!groupe) throw new Error("groupe not found");
    
const members:UserEntity[]=groupe.members;
members.forEach((user)=>{
  if(user.id===userId){
    i++;
  }
});
if(i===0){
  return false;
}else{
  return true;
}
//return false;
  }catch(err){
    throw err;
  }


}

 async addD(groupeId:string,docId:string,userId:string)
 {
  try{

    
    const groupe=await this.getGroupe(groupeId);
    const doc=await this.docservice.getFile(docId);
    const user=await this.userService.getUser(userId);
    const isMembre=await this.isMembre(groupeId,userId);
    //verification
    if(groupe&&doc&&user){
     if((groupe.admin.id===userId)||isMembre){

      groupe.docs.push(doc);
      await this.groupeRepository.save(groupe);
      return groupe; 
     }else{
      throw new Error("cet user n'est pas un memebres de cette groupe ou n'est un admin de ce groupe");
     }
    }else{
      throw new Error("groupe not found or doc not found or user not found");
    }
  }catch(err){
  throw err;
  }
 }
 async getGroupeByadmin(adminId:string):Promise<GroupeEntity[]>
 {
  try{
 const groupes =await this.groupeRepository.find({
  where:{
    admin:{id:adminId}
  }
 });
 if(!groupes) throw new Error("il n'y a pas aucun groupe");
 return groupes
  }catch(err){
    throw err;
  }
 }
 async addPendingUser(userId:string,groupeName:string){
  try{
 const user=await this.userService.getUser(userId);
 const groupe=await this.groupeRepository.findOne({
  where:{name:groupeName},
  relations:['pendingUser']
 });
 if(!groupe!) throw new Error("groupe not found !");
 if(groupe.groupe_racine_id===null){
  groupe.pendingUser.push(user);
  await this.groupeRepository.save(groupe);

 }else{
  throw new Error("cette groupe n'est une entreprise");
 }

  }catch(err){
throw err;
  }
 }


  }