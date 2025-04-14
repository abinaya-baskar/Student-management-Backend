-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('PANCARD', 'BIRTHCERTIFICATE');

-- CreateTable
CREATE TABLE "Student" (
    "roll_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "sec" TEXT NOT NULL,
    "blood_grp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StudentProof" (
    "StudentProof_id" TEXT NOT NULL,
    "proof_type" "ProofType" NOT NULL,
    "proof_url" TEXT NOT NULL,
    "roll_no" TEXT NOT NULL,

    CONSTRAINT "StudentProof_pkey" PRIMARY KEY ("StudentProof_id")
);

-- CreateTable
CREATE TABLE "Student_fee" (
    "Student_fee_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_id" TEXT NOT NULL,
    "roll_no" TEXT NOT NULL,

    CONSTRAINT "Student_fee_pkey" PRIMARY KEY ("Student_fee_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_roll_no_key" ON "Student"("roll_no");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProof_roll_no_key" ON "StudentProof"("roll_no");

-- AddForeignKey
ALTER TABLE "StudentProof" ADD CONSTRAINT "StudentProof_roll_no_fkey" FOREIGN KEY ("roll_no") REFERENCES "Student"("roll_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student_fee" ADD CONSTRAINT "Student_fee_roll_no_fkey" FOREIGN KEY ("roll_no") REFERENCES "Student"("roll_no") ON DELETE RESTRICT ON UPDATE CASCADE;
