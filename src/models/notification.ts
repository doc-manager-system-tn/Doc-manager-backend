import { Column, Entity, JoinColumn, ManyToMany ,ManyToOne, OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";


@Entity("notification")
export class NotificationEntity extends BaseEntity {

    @Column('text')
    message: string;
    @Column({default:false,type:'boolean'})
    isRead:boolean  
    @ManyToOne(()=>UserEntity,{ nullable: true })//admin de notification 
    sender:UserEntity;
   @ManyToOne(()=>UserEntity,user=>user.notifications, { onDelete: 'CASCADE' })
   recipient:UserEntity;

}
