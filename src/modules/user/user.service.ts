import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { UserRole } from 'src/models/user.entity';
import { GroupeService } from '../groupe/groupe.service';
import { UserStatus } from 'src/models/access.entity';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    
  )
    {}

  

  async createUser(user:Partial<UserEntity>):Promise<UserEntity>
  { try{
   const newuser=this.userRepository.create(user);      
    if(!newuser) throw new Error("la creation est échoue")

      return await this.userRepository.save(newuser);

   
  } catch(err){
    throw err;
  }
   
  }

  async verifUserByemail(email:string) 
  {
   
   try{
    const users=await this.userRepository.find({
      where:{email}
     });
     if(users.length===0){
      return true;
     }
     return false;
    
   }catch(err){
     return err;
   }
  }

  async updateUser(id:string,userData:Partial<UserEntity>){
    try{
      const user=await this.userRepository.findOne({
        where :{id}
      });
      if(!user){
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
    const newuser=await this.userRepository.update(id,userData);
        return newuser;

    }catch(err){
      return err;
    }

}

async deleteUser(id:string){
try{return await this.userRepository.delete(id);

}catch(err){
  throw err;
}


}

async getUsers(){
  return await this.userRepository.find();
}

async getUserByEmail(email:string):Promise<UserEntity|null>
{

  return await this.userRepository.findOne({
    where :{email},
  });
  
}
async getUser(id:string):Promise<UserEntity>
{

  const user =await this.userRepository.findOne({
    where :{id}
  });
if(!user){throw new Error("user not found")}
  return user;
  
}
async updateRefreshToken(id: string, token: string) {
  const user = await this.getUser(id);
  if (user){
const newUser={
  ...user,
  refreshToken:token
}
   const newuser= await this.userRepository.update(id,newUser);
   await this.userRepository.save(newUser);

  }
  
}
/*async approvedM(userId:string,desc:boolean){
  try{
    const user=await this.getUser(userId);
    if(desc){   user.status=UserStatus.APPROVED;
    }else{
      user.status=UserStatus.REJECTED;
    }
     await this.userRepository.save(user);
     }catch(err){
      throw err;
     }
  }*/
 /*async getCreatedG(adminId:string){
  try{
    const admin=this.userRepository.findOne({
      where:{id:adminId},
      relations:['createdGroups']
    });
    if(!admin) throw new Error("admin not found !")
      return admin;
  }catch(err){
    throw err
  }
  

 }*/
  



}
