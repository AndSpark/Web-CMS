import {  Column, CreateDateColumn, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

@Entity('ay_content')
export class ContentEntity extends AbstractEntity {
  @Column()
  acode: string;
  
  @Column()
  scode: string;
  
  @Column({default:''})
  subscode: string;
  
  @Column()
  title: string;
  
  @Column({default:'#333333'})
  titlecolor: string;
  
  @Column({default:''})
  subtitle: string;
  
  @Column({default:''})
  filename: string;
  
  @Column({default:'author'})
  author: string;
  
  @Column({default:'本站'})
  source: string;
  
  @Column({default:''})
  outlink: string;
  
  @CreateDateColumn()
  date: string;
  
  @Column({default:''})
  ico: string;
  
  @Column({default:''})
  pics: string;
  
  
  @Column({default:''})
  content: string;
  
  @Column({default:''})
  tags: string;
  
  @Column({default:''})
  enclosure: string;
  
  @Column({default:''})
  keywords: string;
  
  @Column({default:''})
  description: string;
  
  @Column({default:255})
  sorting: number;
  
  @Column({default:'1'})
  status: string;
  
  @Column({default:'0'})
  istop: string;
  
  @Column({default:'0'})
  isrecommend: string;
  
  @Column({default:'0'})
  isheadline: string;
  
  @Column({default:0})
  visits: number;
  
  @Column({default:0})
  likes: number;
  
  @Column({default:0})
  oppose: number;

  
}