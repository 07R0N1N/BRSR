-- Prevent blank organization names
-- Fix any existing blank names first (required before adding constraint)
UPDATE organizations SET name = 'Unnamed Organization' WHERE trim(name) = '' OR name IS NULL;

ALTER TABLE organizations
  ADD CONSTRAINT organizations_name_not_blank
  CHECK (length(trim(name)) > 0);
