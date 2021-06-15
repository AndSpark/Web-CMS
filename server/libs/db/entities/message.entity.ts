import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_message')
export class MessageEntity extends AbstractEntity {
 
  @Column({default:''})
  acode: string;

  @Column({default:''})
  contacts: string;

  @Column({default:''})
  mobile: string;

  @Column({default:''})
  content: string;

  @Column({default:''})
  user_ip: string;

  @Column({default:''})
	user_os: string;
	
  @Column({default:''})
	user_bs: string;
	
  @Column({default:''})
	recontent: string;
	
  @Column({default:''})
	status: string;
	
  @Column({default:''})
	name: string;
	
  @Column({default:''})
	email: string;
	
  @Column({default:''})
	phone: string;
	
  @Column({default:''})
	fax: string;
	
  @Column({default:''})
  message: string;
}