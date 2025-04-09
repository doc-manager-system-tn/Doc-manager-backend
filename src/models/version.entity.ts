import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DocEntity } from "./document.entity";
import { UserEntity } from "./user.entity";


@Entity("version")
export class VersionEntity extends BaseEntity{

    @Column()
    nameV:string;
    @Column()
    path:string;
    @ManyToOne(()=>DocEntity,doc=>doc.versions)
    @JoinColumn({name:"doc_id"})
    doc:DocEntity;
    @ManyToOne(()=>UserEntity,user=>user.versionsD)
    @JoinColumn({name:"modifier_id"})
    modifier:UserEntity;




}
