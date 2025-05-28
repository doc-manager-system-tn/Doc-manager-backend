import { Controller, Get ,Post,Put,Delete,Req, Param, Query} from '@nestjs/common';
import {IResponse } from 'src/common/response.interface';
 import { StatsService } from './stats.service';
import { StatsEntity } from 'src/models/stats.entity';

@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

@Get("/:docId/periode/:nbP")
async getAllS(@Param("docId") docId:string,@Param("nbP") nbP:number):Promise<IResponse<StatsEntity>>
{
const stats=await this.statsService.getStatsForLastPeriod(docId,nbP);
return {
    data:stats,
    status:{
        code:200,
        message:"les statistique sur la dernier periode"
    }
}
}
/*@Get("/:id")
async verif(@Param("id" ) id:string){
    return await this.statsService.verifD(id);
}*/


}