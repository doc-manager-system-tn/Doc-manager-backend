import { Column, Entity ,OneToMany,ManyToOne,ManyToMany, JoinTable} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";



export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYE = 'EMPLOYE'
  }



@Entity("groupe")
export class GroupeEntity extends BaseEntity {

    @Column()
    name:string;
    @Column()
    id_admin:string;
    @Column()
    description:string;
    @Column()
    groupe_racine_id:string;
 @ManyToMany(()=>UserEntity,user=>user.groupes)
    users:UserEntity[]
  @ManyToMany(()=>DocEntity,doc=>doc.groupes)
  @JoinTable({name:"groupe_doc"})
  docs:DocEntity[];

    

}