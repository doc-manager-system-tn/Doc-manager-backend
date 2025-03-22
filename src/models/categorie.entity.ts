import { Column, Entity, JoinColumn, ManyToMany ,ManyToOne, OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";


@Entity("categorie")
export class CategorieEntity extends BaseEntity {

    @Column()
    name:string;
    @Column()
    description:string
    @ManyToOne(()=>UserEntity,user=>user.categories)
    @JoinColumn()
    user:UserEntity;
    @OneToMany(()=>DocEntity,doc=>doc.categorie)
    docs:DocEntity[]; 
}