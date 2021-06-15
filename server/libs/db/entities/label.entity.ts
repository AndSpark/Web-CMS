import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity({name:'ay_label'})
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'integer'})
	id: number
    @Column()
    name: string;
    @Column({default:''})
    value: string;
    @Column()
    type: string;
    @Column()
    description: string;
    @Column({default:'admin'})
    create_user: string;
    @Column({default:'admin'})
    update_user: string;
    @CreateDateColumn()
    create_time: Date | string;
    @UpdateDateColumn()
    update_time: string;
}
