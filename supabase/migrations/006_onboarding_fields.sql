-- Add onboarding fields to organizations table
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS reporting_year TEXT,
  ADD COLUMN IF NOT EXISTS company_type TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS hq_city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS cin TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT false;

-- Allow admins to update their own org (for onboarding setup)
CREATE POLICY "organizations_update_admin_own_org" ON organizations
  FOR UPDATE USING (
    public.user_role_slug() = 'admin'
    AND id IN (SELECT org_id FROM profiles WHERE id = auth.uid() AND org_id IS NOT NULL)
  );

-- Allow admins to read their own org
-- (already covered by organizations_select_own_org policy in migration 001)
