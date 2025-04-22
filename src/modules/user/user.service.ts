import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';
import { UserStatus } from 'src/models/user.entity';
import { UserRole } from 'src/models/user.entity';
import { GroupeService } from '../groupe/groupe.service';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    
  )
    {}

  

  async createUser(user:Partial<UserEntity>):Promise<UserEntity>
  { try{
    const {role}=user;
    if(!role) throw new Error("le role n'a pas mentione !")
    const status = role === UserRole.ADMIN
      ? UserStatus.APPROVED
      : UserStatus.PENDING;
      const dataComplet={
        ...user,
        status
      }
   const newuser=this.userRepository.create(dataComplet);      
    if(!newuser) throw new Error("la creation est échoue")

      this.userRepository.save(newuser);
    return newuser;

   
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
    where :{email}
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




}
