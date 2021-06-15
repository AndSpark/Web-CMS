import {  AfterInsert, BeforeInsert, Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_model')
export class ModelEntity extends AbstractEntity {

  @Column()
  mcode: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  listtpl: string;
  @Column()
  contenttpl: string;
  @Column({ default: '1' })
  status: string;
  @Column({ default: '0' })
  issystem: string;


	// mcode必须有唯一值
	@BeforeInsert()
	index() {
		this.mcode = Math.random().toString()
	}

	@AfterInsert()
	setMcode() {
		this.mcode = this.id.toString()
	}
}