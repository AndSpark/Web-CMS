import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ay_company')
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'integer'})
	id: number
	
  @Column()
  acode: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  postcode: string;

  @Column()
  contact: string;

  @Column()
  mobile: string;

  @Column()
  phone: string;

  @Column()
  fax: string;

  @Column()
  email: string;

  @Column()
  qq: string;

  @Column()
  weixin: string;

  @Column()
  blicense: string;

  @Column()
  other: string;

}