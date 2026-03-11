-- BRSR Phase 1: organizations, roles, profiles, brsr_questions_visibility
-- Run this in Supabase SQL Editor (or via Supabase CLI) for your project.

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (one per client/tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan_tier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roles (system: master, admin, normal + custom)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed system roles
INSERT INTO roles (name, slug, is_system) VALUES
  ('Master', 'master', true),
  ('Admin', 'admin', true),
  ('Normal', 'normal', true);

-- Profiles: extends Supabase auth.users (id = auth.uid())
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  display_name TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BRSR question visibility: which role can see which question (section/principle/code)
CREATE TABLE brsr_questions_visibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  principle_no TEXT NOT NULL,
  question_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, role_id, section, principle_no, question_code)
);

-- Indexes
CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_brsr_visibility_role_org ON brsr_questions_visibility(role_id, org_id);

-- RLS: enable on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brsr_questions_visibility ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role slug (in public so we can create it)
CREATE OR REPLACE FUNCTION public.user_role_slug()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.slug FROM profiles p
  JOIN roles r ON r.id = p.role_id
  WHERE p.id = auth.uid()
$$;

-- Organizations: Master sees all; others see only their org
CREATE POLICY "organizations_select_master" ON organizations
  FOR SELECT USING (public.user_role_slug() = 'master');

CREATE POLICY "organizations_select_own_org" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM profiles WHERE id = auth.uid() AND org_id IS NOT NULL)
  );

CREATE POLICY "organizations_insert_master" ON organizations
  FOR INSERT WITH CHECK (public.user_role_slug() = 'master');

CREATE POLICY "organizations_update_master" ON organizations
  FOR UPDATE USING (public.user_role_slug() = 'master');

-- Roles: everyone can read; only master can insert/update non-system
CREATE POLICY "roles_select_authenticated" ON roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "roles_insert_master" ON roles
  FOR INSERT WITH CHECK (public.user_role_slug() = 'master');

CREATE POLICY "roles_update_master" ON roles
  FOR UPDATE USING (public.user_role_slug() = 'master');

-- Profiles: Master sees all; Admin sees same org; user sees own
CREATE POLICY "profiles_select_master" ON profiles
  FOR SELECT USING (public.user_role_slug() = 'master');

CREATE POLICY "profiles_select_same_org" ON profiles
  FOR SELECT USING (
    org_id = (SELECT org_id FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert_master" ON profiles
  FOR INSERT WITH CHECK (public.user_role_slug() = 'master');

CREATE POLICY "profiles_update_master" ON profiles
  FOR UPDATE USING (public.user_role_slug() = 'master');

-- BRSR visibility: Master and Admin can manage; restrict by org for Admin
CREATE POLICY "brsr_visibility_select_master" ON brsr_questions_visibility
  FOR SELECT USING (public.user_role_slug() = 'master');

CREATE POLICY "brsr_visibility_select_own_org" ON brsr_questions_visibility
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
    OR org_id IS NULL
  );

CREATE POLICY "brsr_visibility_insert_master" ON brsr_questions_visibility
  FOR INSERT WITH CHECK (public.user_role_slug() IN ('master', 'admin'));

CREATE POLICY "brsr_visibility_update_master" ON brsr_questions_visibility
  FOR UPDATE USING (public.user_role_slug() IN ('master', 'admin'));

CREATE POLICY "brsr_visibility_delete_master" ON brsr_questions_visibility
  FOR DELETE USING (public.user_role_slug() IN ('master', 'admin'));

-- Trigger: update profiles.updated_at
CREATE OR REPLACE FUNCTION profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE profiles_updated_at();
