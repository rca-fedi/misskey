const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class mutingReaction1678262866797 {
    name = 'mutingReaction1678262866797'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "muting_reaction" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE, "muteeId" character varying(32) NOT NULL, "muterId" character varying(32) NOT NULL, CONSTRAINT "PK_6f05cf36c2c2e3d114d9834cbde" PRIMARY KEY ("id")); COMMENT ON COLUMN "muting_reaction"."createdAt" IS 'The created date of the Muting.'; COMMENT ON COLUMN "muting_reaction"."muteeId" IS 'The mutee user ID.'; COMMENT ON COLUMN "muting_reaction"."muterId" IS 'The muter user ID.'`);
        await queryRunner.query(`CREATE INDEX "IDX_5fa58973f41b06426e46daad85" ON "muting_reaction" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_4913d3c999b6e53a91c42a1a20" ON "muting_reaction" ("expiresAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d95a5b77ef8f48c8518acdadf" ON "muting_reaction" ("muteeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_062d0d105f1dbc994ae61f1bc2" ON "muting_reaction" ("muterId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3d824e7ed3abdc1220fb95ab71" ON "muting_reaction" ("muterId", "muteeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a9021cc2e1feb5f72d3db6e9f5" ON "abuse_user_report" ("targetUserId") `);
        await queryRunner.query(`ALTER TABLE "muting_reaction" ADD CONSTRAINT "FK_4d95a5b77ef8f48c8518acdadf4" FOREIGN KEY ("muteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "muting_reaction" ADD CONSTRAINT "FK_062d0d105f1dbc994ae61f1bc23" FOREIGN KEY ("muterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_a9021cc2e1feb5f72d3db6e9f5f" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_a9021cc2e1feb5f72d3db6e9f5f"`);
        await queryRunner.query(`ALTER TABLE "muting_reaction" DROP CONSTRAINT "FK_062d0d105f1dbc994ae61f1bc23"`);
        await queryRunner.query(`ALTER TABLE "muting_reaction" DROP CONSTRAINT "FK_4d95a5b77ef8f48c8518acdadf4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9021cc2e1feb5f72d3db6e9f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d824e7ed3abdc1220fb95ab71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_062d0d105f1dbc994ae61f1bc2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d95a5b77ef8f48c8518acdadf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4913d3c999b6e53a91c42a1a20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fa58973f41b06426e46daad85"`);
        await queryRunner.query(`DROP TABLE "muting_reaction"`);
    }
}
