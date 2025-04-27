import { Column, Entity ,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { GroupeEntity } from "./groupe.entity";

export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved'
  }

@Entity("access")
export class AccessEntity extends BaseEntity {

@Column({type:'enum',enum:UserStatus , nullable: true })
status:UserStatus;
@ManyToOne(()=>UserEntity,user=>user.accessUsers)
@JoinColumn()
user:UserEntity;
@ManyToOne(()=>GroupeEntity,groupe=>groupe.accessGroupes)
@JoinColumn()
groupe:GroupeEntity;


}
