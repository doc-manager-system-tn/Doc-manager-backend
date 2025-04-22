import { Column, Entity, JoinColumn, ManyToMany ,ManyToOne} from "typeorm";
import { BaseEntity } from "./base.entity";
import { DocEntity } from "./document.entity";
import { UserEntity } from "./user.entity";






@Entity("feedback")
export class FeedBackEntity extends BaseEntity {

    @Column()
    commentaire:string;
    @Column()
    race:number;
    @ManyToOne(()=>DocEntity,doc=>doc.fedbs)
    @JoinColumn()
    doc:DocEntity;
    @ManyToOne(()=>UserEntity,user=>user.feeds)
    @JoinColumn()
    creator:UserEntity;



    

}