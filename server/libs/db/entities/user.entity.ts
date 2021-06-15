import {  BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import * as bcrypt from 'bcryptjs';

@Entity('ay_user')
export class UserEntity extends AbstractEntity {

  @Column()
  ucode: string;

  @Column()
  username: number;

  @Column()
  realname: string;

	@Column()
	password: string;

	@Column()
  status: string;

  @Column()
  login_count: string;

  @Column()
	last_login_ip: string;
	
	@BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
	}

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
	}
	
	toObj() {
		const {username,realname,status} = this
		return {username,realname,status}
	}
}