import { Controller, UseGuards ,Get ,Post,Put,Delete,Req, Param,Res,Body,Patch,} from '@nestjs/common';
import { Request, Response } from 'express';
import { IResponse } from 'src/common/response.interface';
import { VersionEntity } from 'src/models/version.entity';
import { WebHookService } from './webhook.service';
import { WebHookEntity, WebhookEvent } from 'src/models/webhook.entity';
import { group } from 'console';


@Controller("webhook")
export class WebHookController {
  constructor(private readonly webHookService:WebHookService) {} 

@Post()
async creatWebHook(@Body() body: { target_url: string, events: WebhookEvent[] ,client:string,description:string,userId:string}):Promise<IResponse<WebHookEntity>>{

const webhook=await this.webHookService.createWebook(body.events,body.client,body.target_url,body.description,body.userId);
return {
    data:webhook,
    status:{
        code:201,
        message:"la creation de cette webhook est bien effectuer"
    }
}
}

@Patch(':webhookId/groupes/:groupeId')
async addGroupeToWebhook(
  @Param('webhookId') webhookId: string,
  @Param('groupeId') groupeId: string
 ): Promise<IResponse<WebHookEntity>> {
  const updated = await this.webHookService.addGroupeToWebhook(webhookId, groupeId);
  return {
    data: updated,
    status: {
      code: 200,
      message: "Le groupe a été lié avec succès au webhook"
    }
  };
}

@Get(':userId/groupe/:groupId')

async getWebHooksbyC(
  @Param('userId') userId: string,
  @Param('groupId') groupId: string):Promise<IResponse<WebHookEntity>>
{
  
  const webhooks=await this.webHookService.getWebHooksByG(groupId,userId);
  return {
    data:webhooks,
    status:{
      code:200,
      message:"les informations des webhooks sont bien extracte"
    }
  }
}

}