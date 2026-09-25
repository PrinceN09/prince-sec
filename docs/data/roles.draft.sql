-- PrinceSec database roles. DRAFT. Run once per database by the owner/administrator role,
-- with real passwords supplied from a secrets manager (never committed).
--
-- Principle: the deployed public site can only do what the public site needs.
-- If the application is ever compromised, the attacker inherits app_runtime, not the owner.

-- Owner of the schema. Used ONLY by migrations (DIRECT_URL) from CI or your machine.
-- CREATE ROLE app_migrator LOGIN PASSWORD :'migrator_password';

-- Runtime role for the public site (DATABASE_URL). No DDL, no UPDATE, no DELETE.
CREATE ROLE app_runtime LOGIN PASSWORD :'runtime_password' NOSUPERUSER NOCREATEDB NOCREATEROLE;

GRANT USAGE ON SCHEMA public TO app_runtime;

-- Read the content model.
GRANT SELECT ON
  "Domain", "Tool", "Skill",
  "Project", "ProjectSection", "ProjectDomain", "ProjectTool", "ProjectSkill",
  "Asset",
  "LearningEntry", "LearningEntryDomain", "LearningEntrySkill"
TO app_runtime;

-- The one thing the public site may write: a contact message. It cannot read messages back.
-- INSERT ... RETURNING needs SELECT on whatever is returned, so only the id column is
-- readable. The app must call create({ data, select: { id: true } }).
GRANT INSERT ON "ContactMessage" TO app_runtime;
GRANT SELECT ("id") ON "ContactMessage" TO app_runtime;

-- Defence in depth: even a query bug cannot leak a draft, because the runtime role can only
-- ever SEE public rows. (The owner role bypasses row-level security.)
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
CREATE POLICY runtime_public_projects ON "Project"
  FOR SELECT TO app_runtime USING (visibility = 'PUBLIC');

ALTER TABLE "LearningEntry" ENABLE ROW LEVEL SECURITY;
CREATE POLICY runtime_public_learning ON "LearningEntry"
  FOR SELECT TO app_runtime USING (visibility = 'PUBLIC');

ALTER TABLE "ProjectSection" ENABLE ROW LEVEL SECURITY;
CREATE POLICY runtime_public_sections ON "ProjectSection"
  FOR SELECT TO app_runtime
  USING (EXISTS (SELECT 1 FROM "Project" p WHERE p.id = "projectId" AND p.visibility = 'PUBLIC'));

-- A future admin role gets its own grants in the admin phase; it is never the runtime role.
