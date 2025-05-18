import { Column, Entity, JoinColumn, JoinTable, ManyToMany ,ManyToOne, OneToMany} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { DocEntity } from "./document.entity";


@Entity("categorie")
export class CategorieEntity extends BaseEntity {

    @Column()
    name:string;
    @Column({ type: 'text' })
    description:string
    @ManyToOne(()=>UserEntity,user=>user.categories)
    @JoinColumn()
    user:UserEntity;
    @ManyToMany(()=>DocEntity,doc=>doc.categories)
    @JoinTable({name:"cat_doc"})
    docs:DocEntity[];   
}