-- AlterTable
CREATE SEQUENCE passenger_id_seq;
ALTER TABLE "Passenger" ALTER COLUMN "id" SET DEFAULT nextval('passenger_id_seq'),
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT,
ALTER COLUMN "memberNumber" DROP NOT NULL;
ALTER SEQUENCE passenger_id_seq OWNED BY "Passenger"."id";
