import {  BeforeInsert, Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_content_sort')
export class ContentSortEntity extends AbstractEntity {
  @Column()
  acode: string;
  
  @Column({default:'3'})
  mcode: string;
  
  @Column()
  pcode: string;
  
  @Column()
  scode: string;
  
  @Column()
  name: string;
  
  @Column({default:'product.html'})
  listtpl: string;
  
  @Column({default:'proshow.html'})
  contenttpl: string;
  
  @Column({default:'1'})
  status: string;
  
  @Column({default:''})
  outlink: string;

  @Column({default:''})
  subname: string;
  
  @Column({default:''})
  ico: string;
  
  @Column({default:''})
  pic: string;
  
  @Column({default:''})
  title: string;
  
  @Column({default:''})
  keywords: string;
  
  @Column({default:''})
  description: string;

  @Column({default:''})
  filename: string;
  
  @Column({default:255})
  sorting: number;

  
  
}