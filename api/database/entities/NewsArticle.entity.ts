import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './Tag.entity';

@Entity('news_article')
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  shortdescription: string;

  @ManyToMany(type => Tag, tag => tag.articles, { nullable: false, eager: true }) @JoinTable()
  tags: Tag[];

  @Column({ nullable: false })
  jsonRepresentation: string;

  @Column({ nullable: true })
  previewImage?: string;

  @CreateDateColumn({ nullable: false })
  timestamp?: Date;

  @Column({ nullable: false, type: 'float' })
  lat: number;

  @Column({ nullable: false, type: 'float' })
  lon: number;

  @Column({ nullable: false })
  icon: string;
}
