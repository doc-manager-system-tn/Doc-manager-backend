import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeEntity } from 'src/models/groupe.entity';
import { UserService } from '../user/user.service';
import { DocService } from '../document/document.service';
import { UserEntity } from 'src/models/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { GroupeComplet, IResponse } from 'src/common/response.interface';
import { error } from 'console';
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
      where:{id:id}, relations: ['admin','members','docs'], 
    });
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
 async getCompanyByadmin(adminId:string):Promise<GroupeEntity[]>
 {
  try{
    
 const groupes =await this.groupeRepository.find({
  where:{
    admin:{id:adminId}
  },
  relations: ["admin","members"]
 });
 if(!groupes) throw new Error("il n'y a pas aucun groupe");
 

 const companys:GroupeEntity[]=[];

for(const groupe of groupes){
  if(groupe.groupe_racine_id===null){
    companys.push(groupe);
  }
}
if(!companys) throw new Error("il n'y a pas aucun company");


  return companys;
 
 
 
  }catch(err){
    throw err;
  }
 }
 

 /*async addPendingUser(userId:string,groupeName:string){
  try{
 const user=await this.userService.getUser(userId);
 const groupe=await this.groupeRepository.findOne({
  where:{name:groupeName},
  relations:['pendingUser']
 });
 if(!groupe) throw new Error("groupe not found !");
 if(groupe.groupe_racine_id===null){
  groupe.pendingUsers.push(user);
  await this.groupeRepository.save(groupe);

 }else{
  throw new Error("cette groupe n'est une entreprise");
 }

  }catch(err){
throw err;
  }
 }
*/
async getAllSubGroups(groupId: string): Promise<GroupeEntity[]> {
  try {
    // Fonction récursive pour obtenir tous les sous-groupes d'un groupe
    const getSubGroupsRecursively = async (parentGroupId: string): Promise<GroupeEntity[]> => {
      const subGroups = await this.groupeRepository.find({
        where: {
          groupe_racine_id: parentGroupId, // Recherche les sous-groupes du groupe actuel
        },
        relations:['members','webhooks','docs']
      });

      // Pour chaque sous-groupe trouvé, on continue à chercher ses sous-groupes
      let allSubGroups = [...subGroups]; // On commence par ajouter les sous-groupes du niveau actuel
      for (const subGroup of subGroups) {
        const subSubGroups = await getSubGroupsRecursively(subGroup.id); // Recherche récursive
        allSubGroups = [...allSubGroups, ...subSubGroups]; // Ajouter les sous-sous-groupes
      }
      return allSubGroups;
    };

    // Obtenir les sous-groupes pour le groupe de départ
    const allSubGroups1 = await getSubGroupsRecursively(groupId);
    return allSubGroups1;
  } catch (err) {
    throw err;
  }
}
async findRootCompany(groupe: GroupeEntity, allGroupes: GroupeEntity[]):Promise<GroupeEntity|null>
 {
  let current:GroupeEntity = groupe;
  while (current.groupe_racine_id) {
    const parent = allGroupes.find(g => g.id === current.groupe_racine_id);
    if (!parent) break;
    current = parent;
  }
  //return this.getGroupe(current?.id);
  const currentId=current.id;
  const newCurrent=await this.groupeRepository.findOne({
    where:{id:currentId},
    relations:['admin', 'members','docs']
  })
  if(!newCurrent) return null;
    return newCurrent
  
}

async getGroupesByadmin(adminId: string) :Promise<GroupeComplet<GroupeEntity>[]>
{
  try {
    const groupes = await this.groupeRepository.find({
      where: {
        admin: { id: adminId }
      },
      relations: ['admin', 'members','docs']
    });

    if (!groupes || groupes.length === 0) {
      throw new Error("Il n'y a aucun groupe.");
    }

    const allGroupes = await this.groupeRepository.find(); // pour retrouver les parents et companies

   /* const groupesA: GroupeComplet<GroupeEntity>[] =[] ;
    groupes.map(async (groupe )=> {
      const parent = allGroupes.find(g => g.id === groupe.groupe_racine_id);
      const company = await  this.findRootCompany(groupe, allGroupes);
          
       const datagroupe:GroupeComplet<GroupeEntity>={
        courrentGroupe: groupe,
        parentGroupeN:parent?parent.name:null,
        companyGroupe: company
      };
      //console.log(datagroupe);
      if(datagroupe.courrentGroupe?.groupe_racine_id!==null){
        groupesA.push(datagroupe);
      }
     

    });*/
    const groupesA = await Promise.all(groupes
     // .filter(g => g.groupe_racine_id !== null) // filtre ici si nécessaire
      .map(async (groupe) => {
        const parent = allGroupes.find(g => g.id === groupe.groupe_racine_id);
        const company = await this.findRootCompany(groupe, allGroupes);

        const datagroupe: GroupeComplet<GroupeEntity> = {
          courrentGroupe: groupe,
          parentGroupeN: parent ? parent.name : null,
          companyGroupe: company
        };

        return datagroupe;
      })
    );
console.log(groupesA)
    return groupesA;

  } catch (err) {
    throw err;
  }
}
async getgroupes1Byadmin(adminId:string):Promise<GroupeEntity[]>
 {
  try{
    
 const groupes =await this.groupeRepository.find({
  where:{
    admin:{id:adminId}
  },
  relations: ["admin","members"]
 });
 if(!groupes) throw new Error("il n'y a pas aucun groupe");
 

 const companys:GroupeEntity[]=[];

for(const groupe of groupes){
  if(groupe.groupe_racine_id!==null){
    companys.push(groupe);
  }
}
if(!companys) throw new Error("il n'y a pas aucun company");


  return companys;
 
 
 
  }catch(err){
    throw err;
  }
 }

  async getAllGroupes(adminId:string){
 try{
  const groupes=await this.groupeRepository.find({
    where:{
      admin:{
        id:adminId
      }
    }
  });
  if(!groupes) throw new Error("cet admin n'aucun groupe !");
  return groupes;
 }catch(err){
  throw err;
 }
}


  }