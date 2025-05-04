import { Controller, Get ,Post,Put,Delete,Req, Param} from '@nestjs/common';
import { Request ,Response} from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { AuthenticatedRequest,IResponse } from 'src/common/response.interface';
import { NotificationService } from './notification.service';
import { NotificationEntity } from 'src/models/notification';
@Controller("notification")
export class NotificationController {
  constructor(private readonly notService:NotificationService
  ) {}

@Post()
async createN(@Req() req:Request):Promise<IResponse<NotificationEntity>>
{
const {message,userId,adminId}=req.body;

const notification=await this.notService.createN(message,userId,adminId);
return {
    data:notification,
    status:{
        code:201,
        message:"la notification est bien crée"
    }
}

}
@Get("/byAdmin/:id")
async getNbyAdmin(@Param("id") adminId:string):Promise<IResponse<NotificationEntity>>
{
    const notifications=await this.notService.getNotificationsByadmin(adminId);
   return {
    data :notifications,
    status:{
        code:200,
        message:"les notifictions sont bien extracter"
    }
   }
}
@Get("/byAdminAndUser")
async getNbyAdminAndUser(@Req() req:Request):Promise<IResponse<NotificationEntity>>
{
    const{adminId,userId}=req.body;
    const notifications=await this.notService.getNotifications(userId,adminId);
   return {
    data :notifications,
    status:{
        code:200,
        message:"les notifictions sont bien extracter"
    }
   }
}

}