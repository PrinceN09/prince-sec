-- PrinceSec integrity constraints Prisma cannot express. DRAFT.
--
-- These ship as a hand-written, version-controlled migration in Phase 2b:
--   npx prisma migrate dev --create-only --name integrity_checks
--   (paste this file into the generated migration.sql, review it, then apply)
--
-- They put the site's honesty rules in the database itself, so a bug, a script or a future
-- admin screen cannot publish something that breaks them.

-- A public, completed project must have passed the redaction review.
ALTER TABLE "Project" ADD CONSTRAINT project_public_completed_reviewed
  CHECK (NOT (visibility = 'PUBLIC' AND status = 'COMPLETED' AND NOT "sanitizationReviewed"));

-- Completed means it has a completion date.
ALTER TABLE "Project" ADD CONSTRAINT project_completed_has_date
  CHECK (status <> 'COMPLETED' OR "completedAt" IS NOT NULL);

-- Dates cannot run backwards.
ALTER TABLE "Project" ADD CONSTRAINT project_dates_ordered
  CHECK ("startedAt" IS NULL OR "completedAt" IS NULL OR "completedAt" >= "startedAt");

-- Only public projects can be featured, and there is at most one flagship at a time.
ALTER TABLE "Project" ADD CONSTRAINT project_featured_is_public
  CHECK (NOT featured OR visibility = 'PUBLIC');
CREATE UNIQUE INDEX project_single_featured ON "Project" (featured) WHERE featured;

-- Every asset has real alt text.
ALTER TABLE "Asset" ADD CONSTRAINT asset_alt_not_blank
  CHECK (length(btrim(alt)) > 0);

-- A completed certification/training has a completion date.
ALTER TABLE "LearningEntry" ADD CONSTRAINT learning_completed_has_date
  CHECK (status <> 'COMPLETED' OR "completedAt" IS NOT NULL);

-- Contact rows always carry a future purge date.
ALTER TABLE "ContactMessage" ADD CONSTRAINT contact_purge_after_created
  CHECK ("purgeAfter" > "createdAt");
