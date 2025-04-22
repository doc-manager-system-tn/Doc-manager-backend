import { Column, CreateDateColumn, ManyToOne } from "typeorm";
import {
   
    Entity,
    PrimaryGeneratedColumn,
  
} from 'typeorm';
import { DocEntity } from "./document.entity";

@Entity("stats")
export class StatsEntity {

    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column({ default: 0 })
    nb_use: number;
    @ManyToOne(()=>DocEntity,doc=>doc.stats)
    doc:DocEntity;
    
}