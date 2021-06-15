import {  Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_area')
export class AreaEntity extends AbstractEntity {

  @Column()
  acode: string;

  @Column({default:'0'})
  pcode: string;

  @Column()
  name: string;

  @Column({default:''})
  domain: string;

  @Column()
  is_default: string;
}