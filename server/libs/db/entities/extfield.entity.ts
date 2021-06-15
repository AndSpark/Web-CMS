import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ay_extfield')
export class ExtfieldEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'integer'})
	id: number
	
  @Column()
  mcode: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  value: string;

  @Column()
  description: string;

  @Column()
  sorting: number;
}