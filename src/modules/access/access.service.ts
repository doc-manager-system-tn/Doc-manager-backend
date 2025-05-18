import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeEntity } from 'src/models/groupe.entity';
import { UserService } from '../user/user.service';
import { AccessEntity, UserStatus } from 'src/models/access.entity';
import { GroupeService } from '../groupe/groupe.service';

@Injectable()
export class AccessService {

  constructor(
    @InjectRepository(AccessEntity) private readonly accessRepository: Repository<AccessEntity>,
    @InjectRepository(GroupeEntity) private readonly groupeRepository: Repository<GroupeEntity>,
    private readonly userService: UserService,
    private readonly groupeService:GroupeService
  )
    {}
   
 async createAccess(groupeName:string,userId:string){
    try{
        const user=await this.userService.getUser(userId);
        const groupe=await this.groupeRepository.findOne({
            where:{name:groupeName}
        });
        const status=UserStatus.PENDING;
        if(!groupe||groupe.groupe_racine_id!==null) throw new Error("groupe not found or not company");
        const access=this.accessRepository.create({
            user,
            groupe,
          status
        });
        await this.accessRepository.save(access);
        console.log(access)
    }catch(err){
        throw err;
    }
}
async addApproved(groupeId:string,userId:string){
try{
    const user = await this.userService.getUser(userId);
    const groupe = await this.groupeRepository.findOne({
        where:{id:groupeId}
    });
    

    if (!groupe || !user) throw new Error("User or Groupe not found");
    if (groupe.groupe_racine_id !== null) throw new Error("Ce groupe n'est pas une entreprise (groupe racine)");

    const access = await this.accessRepository.findOne({
      where: { 
        user: { id: userId },
        groupe: { id: groupeId },
      },
      relations: ['user', 'groupe']
    });

    if (!access) throw new Error("Relation d'accès introuvable");
    if (access.status === UserStatus.APPROVED) throw new Error("Cet utilisateur est déjà approuvé");

    access.status = UserStatus.APPROVED;
    await this.accessRepository.save(access);

}catch(err){
    throw err;
}
}
async getAccessgroupe(groupeId:string):Promise<AccessEntity[]>
{
    try{
      const access=this.accessRepository.find({
        where:{
            groupe:{id:groupeId}
        },
        relations:['groupe','user']
      });
      if (!access) throw new Error("access not found");
      return access;
    }catch(err){
        throw err;
    }
    

}


async getAccessByadmin(adminId: string): Promise<AccessEntity[]> {
    try {
      const admin = await this.userService.getUser(adminId);
      const groupes = await this.groupeService.getCompanyByadmin(admin.id);
  
      const allAccessPromises = groupes.map((groupe) =>
        this.getAccessgroupe(groupe.id)
      );
  
      const accessArrays = await Promise.all(allAccessPromises);
  
      // Aplatir le tableau de tableaux en un seul tableau
      const allAccess: AccessEntity[] = accessArrays.flat();
  
      return allAccess;
    } catch (err) {
      throw err;
    }
  }
  async getAccess(nameGroupe:string,email:string):Promise<AccessEntity>
  {
    try{
    const access=await this.accessRepository.findOne({
      where:{
        user:{
       email
        },
        groupe:{
          name:nameGroupe
        }
      }
    });
    if(!access) throw new Error("cet user n'aucun access sur le ce groupe la !")
      return access;
    }catch(err){
      throw err;
    }
  }
  async getAcessById(id:string){
  try{
    const access=await this.accessRepository.findOne({
      where:{id},
      relations:['groupe']
    });
    if(!access) throw new Error("n'aucun access avec cet identifinat !");
    return access;
  }catch(err){
    throw err;
  }
}
}

