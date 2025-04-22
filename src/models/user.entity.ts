import { Column, Entity ,JoinColumn,JoinTable,ManyToMany,OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategorieEntity } from "./categorie.entity";
import { GroupeEntity } from "./groupe.entity";
import { DocEntity } from "./document.entity";
import { VersionEntity } from "./version.entity";
import { FeedBackEntity } from "./feedback.entity";



export enum UserRole {
    ADMIN = 'ADMIN',
    EMPOLYE = 'EMPOLYE'
  }
  export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
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
     @Column({type:'enum',enum:UserStatus , nullable: true })
     status:UserStatus;
   @OneToMany(()=>CategorieEntity,categorie=>categorie)
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
    @ManyToMany(() => GroupeEntity, groupe => groupe.pendingUser)
 pendingGroupe: GroupeEntity[];

}