import { Controller, Get ,Param,Put,Query} from '@nestjs/common';
import { Public } from '../auth/decorateur/public.decorateur';
import { IResponse } from 'src/common/response.interface';
import { GroupeService } from '../groupe/groupe.service';
import { UserService } from '../user/user.service';
import { AccessService } from './access.service';
import { GroupeEntity } from 'src/models/groupe.entity';
import { AccessEntity } from 'src/models/access.entity';


@Controller("access")
export class AccessController {
  constructor(private readonly groupeService: GroupeService,
      private readonly userService:UserService,
      private readonly accessService:AccessService) {}

@Put("/approvedU")
async appproveU(@Query("adminId") adminId:string,@Query("groupeId") groupeId:string,@Query("userId") userId:string):Promise<IResponse<GroupeEntity>>
{
     await this.accessService.addApproved(groupeId,userId);
     const newgroupe=await this.groupeService.addM(userId,groupeId,adminId);
return {
 data:newgroupe,
 status:{
 code:200,
 message:`cet utlisateur a une access pour le groupe d'id :${groupeId}`
} 
}
}
@Get("/:id")
async getAccessByAdmin(@Param("id") id:string):Promise<IResponse<AccessEntity[]>>
{
    const groupes=await this.accessService.getAccessByadmin(id);
return {
 data:groupes,
 status:{
 code:200,
 message:`les informations des access sont bien extractes`
} 
}
}


}




