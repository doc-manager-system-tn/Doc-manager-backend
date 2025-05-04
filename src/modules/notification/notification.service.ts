import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { UserRole } from 'src/models/user.entity';
import { GroupeService } from '../groupe/groupe.service';
import { UserStatus } from 'src/models/access.entity';
import { NotificationEntity } from 'src/models/notification';
import { UserService } from '../user/user.service';
@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(NotificationEntity) private readonly notiRepository: Repository<NotificationEntity>,
    private readonly userService: UserService
    
  )
    {}
async createN(message:string,userId:string,adminId:string):Promise<NotificationEntity>
{
try{
const admin=await this.userService.getUser(adminId);
const recipient=await this.userService.getUser(userId);
if(admin.role!=="ADMIN") throw new Error("cet utilisateur n'est pas un admin");
const dataN:Partial<NotificationEntity>={
    sender:admin,
    recipient,
    message
    }
 const notification= this.notiRepository.create(dataN);
  if(!notification) throw new Error("le processus de creation de notification est echoué !");
  return await this.notiRepository.save(notification);

}catch(err){
  throw err;
}
}
async getNotifications(userId:string,adminId:string){
try{
  const nots=await this.notiRepository.find({
    where:{
    sender:{id:adminId},
    recipient:{id:userId}
    },
    relations:["sender","recipient"]
  });
  if(!nots) throw new Error("n'aucune notification");
  return nots;
}catch(err){
    throw err;
}
}

async getNotificationsByadmin(adminId:string){
    try{
      const nots=await this.notiRepository.find({
        where:{
        sender:{id:adminId}
        },
        relations:["sender","recipient"]
      });
      if(!nots) throw new Error("n'aucune notification");
      return nots;
    }catch(err){
        throw err;
    }
    }
}
