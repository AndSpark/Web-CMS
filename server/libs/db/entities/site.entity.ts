import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ay_site')
export class SiteEntity extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'integer'})
  id: number

  @Column()
  acode: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  domain: string;

  @Column()
  logo: string;

  @Column()
  keywords: string;

  @Column()
  description: string;

  @Column()
  icp: string;

  @Column()
  theme: string;

  @Column()
  statistical: string;

  @Column()
  copyright: string;

}