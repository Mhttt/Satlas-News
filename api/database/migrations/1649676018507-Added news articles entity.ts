import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedNewsArticlesEntity1649676018507 implements MigrationInterface {
    name = 'AddedNewsArticlesEntity1649676018507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "shortdescription" character varying NOT NULL, "tags" character varying NOT NULL, "jsonRepresentation" character varying NOT NULL, "previewImage" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_12e2ec4b5482dadc50ee88e0da1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "news_article"`);
    }

}
