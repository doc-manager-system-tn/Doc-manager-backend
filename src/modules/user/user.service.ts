import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>)
    {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(user:Partial<UserEntity>):Promise<any>
  {
    const newuser=this.userRepository.create(user);
    this.userRepository.save(newuser);
  return newuser;
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

return await this.userRepository.delete(id);

}
async getUsers(){
  return await this.userRepository.find();
}

async getUser(email:string):Promise<UserEntity|null>
{

  return await this.userRepository.findOne({
    where :{email}
  });
}




}
