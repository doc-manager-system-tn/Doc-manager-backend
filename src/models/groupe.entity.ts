import { Column, Entity ,OneToMany,ManyToOne,ManyToMany, JoinTable, JoinColumn} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";







@Entity("groupe")
export class GroupeEntity extends BaseEntity {

    @Column()
    name:string;
    @Column({ type: 'text' })
    description:string;
    @Column({nullable:true,type: 'varchar', length: 255})
    groupe_racine_id:string|null;
 @ManyToMany(()=>UserEntity,user=>user.memberGroups)
  members:UserEntity[];
  @ManyToMany(()=>DocEntity,doc=>doc.groupes)
  @JoinTable({name:"groupe_doc"})
  docs:DocEntity[];
  @ManyToOne(()=>UserEntity,user=>user.createdGroups)
  @JoinColumn({name:"admin_id"})
  admin:UserEntity;
  @ManyToMany(() => UserEntity,user=>user.pendingGroupe)
@JoinTable({ name: "groupe_pending_user" })
pendingUser: UserEntity[];

    

}