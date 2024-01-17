import {MigrationInterface, QueryRunner} from "typeorm";

export class TagSupportCategoryRemoval1652384098551 implements MigrationInterface {
    name = 'TagSupportCategoryRemoval1652384098551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "icon" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_article_tags_tags" ("newsArticleId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_1e5b6142b2d691e10b650a3a14e" PRIMARY KEY ("newsArticleId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_922bfa62fb8a6204d8ee9f6466" ON "news_article_tags_tags" ("newsArticleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb1c5b0755c9d07fa3116d669e" ON "news_article_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "news_article_tags_tags" ADD CONSTRAINT "FK_922bfa62fb8a6204d8ee9f64667" FOREIGN KEY ("newsArticleId") REFERENCES "news_article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "news_article_tags_tags" ADD CONSTRAINT "FK_fb1c5b0755c9d07fa3116d669e7" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article_tags_tags" DROP CONSTRAINT "FK_fb1c5b0755c9d07fa3116d669e7"`);
        await queryRunner.query(`ALTER TABLE "news_article_tags_tags" DROP CONSTRAINT "FK_922bfa62fb8a6204d8ee9f64667"`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "tags" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb1c5b0755c9d07fa3116d669e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_922bfa62fb8a6204d8ee9f6466"`);
        await queryRunner.query(`DROP TABLE "news_article_tags_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
