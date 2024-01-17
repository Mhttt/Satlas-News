import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';

import { NewsArticle } from './NewsArticle.entity';

@Entity('tags')
export class Tag {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    icon: string;

    @ManyToMany(type => NewsArticle, article => article.tags, { nullable: false }) 
    articles?: NewsArticle[];
}