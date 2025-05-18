import { Controller, Get ,Post,Put,Delete,Req, Param, Query} from '@nestjs/common';
import { Request ,Response} from 'express';
import { FeedbackService } from './feedback.service';
import { IResponse } from 'src/common/response.interface';
import { FeedBackEntity } from 'src/models/feedback.entity';
import { StatsService } from '../stats/stats.service';

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService,
 private readonly statsService:StatsService
  ) {} 


@Post()
async createF(@Req() req:Request):Promise<IResponse<FeedBackEntity>>
{
  const {docId,userId,commentaire}=req.body;

const newFeedb=await this.feedbackService.createF(commentaire,docId,userId);
 await this.statsService.updateUsageStats(newFeedb.doc?.id);
return {
  data:newFeedb,
  status:{
    code:201,
    message:"le feedback est se crée avec succés"
  }
}
}
@Get()
async getAll():Promise<IResponse<FeedBackEntity>>
{
  const feedbs=await this.feedbackService.getAllF();
  return {
    data:feedbs,
    status:{
      code:200,
      message:"les information sont extractes avec succés"
    }
  }
  }
@Get("/:id")
async getF(@Param("id") id:string):Promise<IResponse<FeedBackEntity>>
{
  const feedb=await this.feedbackService.getF(id);
  await this.statsService.updateUsageStats(feedb.doc?.id);
  return {
    data:feedb,
    status:{
      code:200,
      message:"les information sont extractes avec succés"
    }
  }
  }




}

