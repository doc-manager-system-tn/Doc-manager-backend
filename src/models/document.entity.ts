import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { FeedBackEntity } from "./feedback.entity";
import { GroupeEntity } from "./groupe.entity";
import { CategorieEntity } from "./categorie.entity";
import { VersionEntity } from "./version.entity";
import { StatsEntity } from "./stats.entity";


export enum DocFormat {
    pdf="pdf",
    txt="txt",
    docx="docx"
}




@Entity("doc")
export class DocEntity extends BaseEntity {

    @Column()
    titre:string;
    @Column({type:"enum",enum:DocFormat,nullable:true})
    format:DocFormat|null;
    @OneToMany(()=>StatsEntity,stat=>stat.doc)
    stats:StatsEntity[];
    @OneToMany(()=>FeedBackEntity,fedb=>fedb.doc)
    fedbs:FeedBackEntity[];
    @ManyToMany(()=>GroupeEntity,groupe=>groupe.docs)
    groupes:DocEntity[];
    @ManyToOne(()=>UserEntity,user=>user.docs)
    @JoinColumn({name:"creator_id"})
    creator:UserEntity;
    @ManyToMany(()=>CategorieEntity,categorie=>categorie.docs)
    categories:CategorieEntity[];
    @OneToMany(()=>VersionEntity,version=>version.doc)
    versions:VersionEntity[]; 


    

}