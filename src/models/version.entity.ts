import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DocEntity } from "./document.entity";


@Entity("version")
export class VersionEntity extends BaseEntity{

    @Column({default:"v0"})
    nameV:string;
    @Column()
    path:string;
    @ManyToOne(()=>DocEntity,doc=>doc.versions)
    @JoinColumn({name:"doc_id"})
    doc:DocEntity;




}
