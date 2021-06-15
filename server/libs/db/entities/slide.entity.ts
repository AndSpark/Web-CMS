import {  Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_slide')
export class SlideEntity extends AbstractEntity {

  @Column()
  acode: string;

  @Column()
  gid: number;

  @Column()
  pic: string;

  @Column()
	link: string;
	@Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  sorting: string;
}