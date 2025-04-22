import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";






@Entity("webhook")
export class WebHookEntity extends BaseEntity {

    @Column()
    url_input:string;
    @Column()
    url_output:string;
    @Column()
    description:string;
    
    
}