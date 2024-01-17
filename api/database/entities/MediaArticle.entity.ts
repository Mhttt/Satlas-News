import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('media_article')
export class MediaArticle {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false, type: 'float' })
  lat: number;

  @Column({ nullable: false, type: 'float' })
  lon: number;

  @Column({ nullable: false })
  preview: string;

  @CreateDateColumn({ nullable: false })
  timestamp?: Date;

  @Column({ nullable: false })
  category: string;
}
