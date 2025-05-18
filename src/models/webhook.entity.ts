import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { GroupeEntity } from "./groupe.entity";
import { UserEntity } from "./user.entity";


export enum WebhookEvent {
    DOCUMENT_CREATED = 'document.created',
    DOCUMENT_UPDATED = 'document.updated',
    DOCUMENT_DOWNLOADED = 'document.downloaded',
  }



@Entity("webhook")
export class WebHookEntity extends BaseEntity {

    @Column({nullable:true,type:'text'})
    target_url:string;
    @Column()
    client:string;
    @Column('simple-array')
    events:WebhookEvent[];
    @Column({ type: 'text' })
    description:string;
    @ManyToMany(()=>GroupeEntity,groupe=>groupe.webhooks)
    @JoinTable({name:"groupe_webhook"})
    groupes:GroupeEntity[];
    @ManyToOne(()=>UserEntity,user=>user.webHooks)
    user:UserEntity;
    
    
}