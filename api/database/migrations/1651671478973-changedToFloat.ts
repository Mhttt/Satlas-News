import {MigrationInterface, QueryRunner} from "typeorm";

export class changedToFloat1651671478973 implements MigrationInterface {
    name = 'changedToFloat1651671478973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lon" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_article" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "media_article" ADD "lat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_article" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "media_article" ADD "lon" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_article" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "media_article" ADD "lon" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_article" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "media_article" ADD "lat" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lon" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_article" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "news_article" ADD "lat" integer NOT NULL`);
    }

}
