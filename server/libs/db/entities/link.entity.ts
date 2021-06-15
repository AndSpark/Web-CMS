import {  Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_link')
export class LinkEntity extends AbstractEntity {

  @Column()
  acode: string;

  @Column()
  gid: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  logo: string;

  @Column()
  sorting: string;
}