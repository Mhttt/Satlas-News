import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedIconAndCategoryToNewsArticle1651692687412 implements MigrationInterface {
    name = 'AddedIconAndCategoryToNewsArticle1651692687412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "icon" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" ALTER COLUMN "previewImage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" ALTER COLUMN "previewImage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "category"`);
    }

}
