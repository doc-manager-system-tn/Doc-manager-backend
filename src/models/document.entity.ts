import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { FeedBackEntity } from "./feedback.entity";
import { GroupeEntity } from "./groupe.entity";
import { CategorieEntity } from "./categorie.entity";


enum DocFormat {
    WORD="WORD",
    PDF="PDF"
}




@Entity("doc")
export class DocEntity extends BaseEntity {

    @Column()
    titre:string;
    @Column()
    path:string;
    @Column({type:"enum",enum:DocFormat})
    format:DocFormat;
    @Column({default:0})
    nb_utilisation:number;
    @OneToMany(()=>FeedBackEntity,fedb=>fedb.doc)
    fedbs:FeedBackEntity[];
    @ManyToMany(()=>GroupeEntity,groupe=>groupe.docs)
    groupes:DocEntity[];
    @ManyToOne(()=>UserEntity,user=>user.docs)
    @JoinColumn({name:"creator_id"})
    creator:UserEntity;
    @ManyToOne(()=>CategorieEntity,categorie=>categorie.docs)
    @JoinColumn()
    categorie:CategorieEntity;
   

    

}