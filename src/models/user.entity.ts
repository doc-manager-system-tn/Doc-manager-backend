import { Column, Entity ,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategorieEntity } from "./categorie.entity";
import { GroupeEntity } from "./groupe.entity";
import { DocEntity } from "./document.entity";
import { VersionEntity } from "./version.entity";
import { FeedBackEntity } from "./feedback.entity";
import { AccessEntity } from "./access.entity";
import { NotificationEntity } from "./notification";
import { WebHookEntity } from "./webhook.entity";



export enum UserRole {
    ADMIN = 'ADMIN',
    EMPOLYE = 'EMPOLYE'
  }


@Entity("employee")
export class UserEntity extends BaseEntity {

    @Column()
    username:string;
    @Column()
    email:string;
    @Column()
    password:string;
    @Column({type:'enum',enum:UserRole})  
     role:UserRole;
     @Column({ type: 'text', nullable: true })
     refreshToken:string;
    // @Column({type:'enum',enum:UserStatus , nullable: true })
     //status:UserStatus;
   @OneToMany(()=>CategorieEntity,categorie=>categorie.user)
    categories:CategorieEntity[];
    @ManyToMany(()=>GroupeEntity,groupe=>groupe.members)
    @JoinTable({name:"groupe_employe"})
    memberGroups:GroupeEntity[];
    @OneToMany(()=>DocEntity,doc=>doc.creator)
    docs:DocEntity[];
    @OneToMany(()=>GroupeEntity,groupe=>groupe.admin)
    createdGroups:GroupeEntity[];
    @OneToMany(()=>VersionEntity,version=>version.modifier)
    versionsD:VersionEntity[];
    @OneToMany(()=>FeedBackEntity,feedb=>feedb.creator)
    feeds:FeedBackEntity[];
   /* @ManyToOne(() => GroupeEntity, groupe => groupe.pendingUsers)
    @JoinColumn({name:"pending_groupeId"})
 pendingGroupe: GroupeEntity;*/
 @OneToMany(()=>AccessEntity,access=>access.user)
 accessUsers:AccessEntity[];
 @OneToMany(()=>NotificationEntity,not=>not.recipient)
  notifications:NotificationEntity[];
  @OneToMany(()=>WebHookEntity,wh=>wh.user)
  webHooks:WebHookEntity[];

}