-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "applicant_id" TEXT,
    "status" TEXT NOT NULL,
    "reference_number" TEXT,
    "initiated_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_enrollment_id_key" ON "enrollments"("enrollment_id");

-- CreateIndex
CREATE INDEX "enrollments_status_idx" ON "enrollments"("status");

-- CreateIndex
CREATE INDEX "enrollments_deleted_at_idx" ON "enrollments"("deleted_at");
