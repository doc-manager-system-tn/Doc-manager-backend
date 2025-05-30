import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackEntity } from 'src/models/feedback.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/models/user.entity';
import { DocService } from '../document/document.service';

@Injectable()
export class FeedbackService {

  constructor(
    @InjectRepository(FeedBackEntity) private readonly feedbackRepository: Repository<FeedBackEntity>,
  private readonly userService:UserService,
  private readonly docservice:DocService
  )
    {}

    async createF(commentaire:string,docId:string,userId:string):Promise<FeedBackEntity>
    {
      try{
      const datacomplet={
        commentaire,
        doc:{id:docId},
        creator:{id:userId}
      }     
const newFeed=this.feedbackRepository.create(datacomplet);
//await this.docservice.incNbUse(docId);
  const newFeed1=await this.feedbackRepository.save(newFeed);
  return newFeed1;
      } catch(err){
throw err;
      } 
  
    }
async getF(feedId:string){
  try{
const feed=await this.feedbackRepository.findOne({
  where:{id:feedId},
  relations:['doc','creator']
});
if(!feed) throw new Error("feedBack not found!");
return feed;
  }catch(err){
throw err;
  }
}
async getAllF(){
  try{
const feeds=await this.feedbackRepository.find(
  {relations:['doc','creator']}
);

return feeds;
  }catch(err){
    throw err;
  }
  
  
}
   
   async deleteF(userId:string,feedId:string):Promise<void>
    {
      try{
  const user=await this.userService.getUser(userId);
  const role=user.role;
  const feedB=await this.getF(feedId);
  /**/
  if(role!=="ADMIN"){
    throw new Error("user not admin");
     }
  const feedD= await this.feedbackRepository.delete(feedId);

      }catch(err){
        throw err;
      }
    }
}