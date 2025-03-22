import { Column, Entity ,JoinColumn,JoinTable,ManyToMany,OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategorieEntity } from "./categorie.entity";
import { GroupeEntity } from "./groupe.entity";
import { DocEntity } from "./document.entity";



export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYE = 'EMPLOYE'
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
   @OneToMany(()=>CategorieEntity,categorie=>categorie)
    categories:CategorieEntity[];
    @ManyToMany(()=>GroupeEntity,groupe=>groupe.users)
    @JoinTable({name:"groupe_employe"})
    groupes:GroupeEntity[]
    @OneToMany(()=>DocEntity,doc=>doc.creator)
    docs:DocEntity[];

}