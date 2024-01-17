import {MigrationInterface, QueryRunner} from "typeorm";

export class MediaArticle1649444801671 implements MigrationInterface {
    name = 'MediaArticle1649444801671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media_article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "lat" integer NOT NULL, "lon" integer NOT NULL, "preview" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "category" character varying NOT NULL, CONSTRAINT "PK_d5fdfb2ecfc4604d93d18527da9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "media_article"`);
    }

}
