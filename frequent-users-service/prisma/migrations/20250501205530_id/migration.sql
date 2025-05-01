-- AlterTable
CREATE SEQUENCE pendingnamechanges_id_seq;
ALTER TABLE "pendingNameChanges" ALTER COLUMN "id" SET DEFAULT nextval('pendingnamechanges_id_seq');
ALTER SEQUENCE pendingnamechanges_id_seq OWNED BY "pendingNameChanges"."id";
