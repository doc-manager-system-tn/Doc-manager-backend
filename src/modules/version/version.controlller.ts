import { Controller, UseGuards ,Get ,Post,Put,Delete,Req, Param,Res} from '@nestjs/common';
import { VersionService } from './version.service';
import { Request, Response } from 'express';
import { IResponse } from 'src/common/response.interface';
import { VersionEntity } from 'src/models/version.entity';


@Controller("version")
export class VersionController {
  constructor(private readonly versionService:VersionService) {} 

@Post("/:id")
async createVersion(@Req() req:Request,@Param("id") id:string):Promise<IResponse<VersionEntity>>
{
const {url,docId}=req.body;
const newvesion=await this.versionService.createV(url,id,docId);
return {
    data:newvesion,
    status:{
        code:201,
     message:"la création de version a était effecuter avec succes"
    }
};
}



}