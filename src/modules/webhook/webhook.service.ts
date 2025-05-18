import { Injectable, NotFoundException  } from '@nestjs/common';
import { Admin, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionEntity } from 'src/models/version.entity';
import { DocService } from '../document/document.service';
import { WebHookEntity, WebhookEvent } from 'src/models/webhook.entity';
import { GroupeService } from '../groupe/groupe.service';
import { DocEntity } from 'src/models/document.entity';
import { GroupeEntity } from 'src/models/groupe.entity';
import axios from 'axios';
import { UserService } from '../user/user.service';
@Injectable()
export class WebHookService {

  constructor(
    @InjectRepository(WebHookEntity) private readonly webhookRepository: Repository<WebHookEntity>,
    @InjectRepository(GroupeEntity) private readonly groupeRepository: Repository<GroupeEntity>,
    @InjectRepository(DocEntity) private readonly docRepository: Repository<DocEntity>,
    private readonly userService: UserService,
     private readonly groupeService: GroupeService,

)
    {}

async createWebook(events:WebhookEvent[],client:string,target_url:string,description:string,userId:string):Promise<WebHookEntity>
{
 try{
  const user=await this.userService.getUser(userId);
const webhook= this.webhookRepository.create({
  client,
  events,
  target_url,
  description,
  user
   });
  if(!webhook) throw new Error("la creation de cette webhook n'est pas effectuer");
  const webhook1=await this.webhookRepository.save(webhook);
  return webhook1;
  }catch(err){
    throw err;
   }

}

async triggerEvent(event:WebhookEvent,docId:string)
{
    try{
        const document = await this.docRepository.findOne({
            where: { id: docId },
          });
          if (!document) throw new Error("Document non trouvé");
   console.log(document)

      const groupes=await this.groupeRepository.find({
        where:{
            docs:{
                id:docId
            }
        },
        relations:['webhooks']
      });
      
    if(!groupes||groupes.length===0) throw new Error("n'aucune groupe qui contient ce document");
    console.log(groupes)
    for (const groupe of groupes) {
        for (const webhook of groupe?.webhooks) {
          if (!webhook?.events?.includes(event)) continue;
        

          const body = {
            event,
            data: document, // ou transformer en DTO si besoin
          };
     console.log(body)
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          try {
            await axios.post(webhook.target_url, body, { headers });
            console.log(`✅ Webhook envoyé à ${webhook.target_url}`);
          } catch (err) {
            console.error(`❌ Échec webhook vers ${webhook.target_url}`, err.message);
          }
        }
    
    
    }



        }catch(err){
            throw err;
        }
}

 async addGroupeToWebhook(webhookId: string, groupeId: string): Promise<WebHookEntity> {
  try{
    const webhook = await this.webhookRepository.findOne({
      where: { id: webhookId },
      relations: ['groupes'],
      });
  
      if (!webhook) {
      throw new Error("Webhook introuvable");
     }
  
    const groupe = await this.groupeRepository.findOneBy({ id: groupeId });
  
     if (!groupe) {
      throw new Error("Groupe introuvable");
    }
  
    // Vérifie si le groupe est déjà lié
     if (webhook.groupes.some(g => g.id === groupe.id)) {
      throw new Error("Ce groupe est déjà lié à ce webhook");
     }
  
     webhook.groupes.push(groupe);
      return this.webhookRepository.save(webhook);
  }catch(err){
    throw err;
  }
  
}
async getWById(webhId:string)
{
  try{
  const webhook=await this.webhookRepository.findOne({
    where:{id:webhId},
    relations:['user','groupes']
  });
  if(!webhook) throw new Error("webhook not found");
  return webhook;
  }catch(err){
throw err;
  }
}
async getWebHooksByG(groupId:string,userId:string){
  try{
    const groupes=await this.groupeService.getAllSubGroups(groupId);
    const AllWbHs=await this.webhookRepository.find({
       relations:['user','groupes']
    });
    //console.log(groupes);
    const webHooks:WebHookEntity[]=[];
      const webhookIds = new Set<string>();
   
    if (!groupes || groupes.length === 0) {
    throw new Error("Cette company n'a aucun sous-groupe ou n'est pas une company");
  }
    for(let groupe of groupes){
      if(groupe?.webhooks){
        for(let webh of groupe?.webhooks){
        //console.log(webh);
    if (!webhookIds.has(webh?.id)) {
          const fullWb = await this.getWById(webh.id); // enrichi avec user/groupes si nécessaire
          if (fullWb) {
            webhookIds.add(fullWb.id);
            webHooks.push(fullWb);
          }
        }
      }
      }
      
    }
    if(AllWbHs?.length!==0){
      for(let wb of AllWbHs){
         if (wb?.user?.id === userId && !webhookIds.has(wb.id)) {
        webhookIds.add(wb.id);
        webHooks.push(wb);
      }
      }
    }

 return webHooks;
  }catch(err){
    throw err;
  }
}


}