import {MigrationInterface, QueryRunner} from "typeorm";

export class addedLatLongToNewsArticle1651594644529 implements MigrationInterface {
    name = 'addedLatLongToNewsArticle1651594644529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lat" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lon" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lat"`);
    }

}
