import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'integer'})
  id: number

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;

  @Column({ default: 'admin' })
  create_user: string;

  @Column({default:'admin'})
  update_user: string;
  
}
