import { Column, Entity ,OneToMany,ManyToOne,ManyToMany, JoinTable, JoinColumn} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";
import { AccessEntity } from "./access.entity";







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
  //@OneToMany(() => UserEntity,user=>user.pendingGroupe)
//pendingUsers: UserEntity[];
@OneToMany(()=>AccessEntity,access=>access.groupe)
accessGroupes:AccessEntity[];

    

}