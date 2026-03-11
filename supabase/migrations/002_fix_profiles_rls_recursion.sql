-- Fix infinite recursion: profiles RLS policies must not read from profiles.
-- Use a cache table (user_id -> role_slug, org_id) maintained by trigger.
-- Run this AFTER 001_initial_schema.sql in Supabase SQL Editor.

-- Cache: current user's role_slug and org_id (no RLS that reads profiles)
CREATE TABLE IF NOT EXISTS public.user_role_slug_cache (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_slug TEXT NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL
);

-- Keep cache in sync when profiles change
CREATE OR REPLACE FUNCTION public.sync_user_role_slug_cache()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_role_slug_cache (user_id, role_slug, org_id)
  SELECT NEW.id, r.slug, NEW.org_id
  FROM public.roles r WHERE r.id = NEW.role_id
  ON CONFLICT (user_id) DO UPDATE SET role_slug = EXCLUDED.role_slug, org_id = EXCLUDED.org_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_user_role_slug_cache_trigger ON public.profiles;
CREATE TRIGGER sync_user_role_slug_cache_trigger
  AFTER INSERT OR UPDATE OF role_id, org_id ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_role_slug_cache();

-- Backfill cache from existing profiles
INSERT INTO public.user_role_slug_cache (user_id, role_slug, org_id)
SELECT p.id, r.slug, p.org_id
FROM public.profiles p
JOIN public.roles r ON r.id = p.role_id
ON CONFLICT (user_id) DO UPDATE SET role_slug = EXCLUDED.role_slug, org_id = EXCLUDED.org_id;

-- Helper: use cache so we never read profiles inside RLS
CREATE OR REPLACE FUNCTION public.current_user_role_slug()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role_slug FROM public.user_role_slug_cache WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT org_id FROM public.user_role_slug_cache WHERE user_id = auth.uid()
$$;

-- Drop old profiles policies (they cause recursion)
DROP POLICY IF EXISTS "profiles_select_master" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_same_org" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_master" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_master" ON public.profiles;

-- Profiles: Master sees all; Admin sees same org; user sees own (using cache only)
CREATE POLICY "profiles_select_master" ON public.profiles
  FOR SELECT USING (public.current_user_role_slug() = 'master');

CREATE POLICY "profiles_select_same_org" ON public.profiles
  FOR SELECT USING (public.current_user_org_id() IS NOT NULL AND org_id = public.current_user_org_id());

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert_master" ON public.profiles
  FOR INSERT WITH CHECK (public.current_user_role_slug() = 'master');

CREATE POLICY "profiles_update_master" ON public.profiles
  FOR UPDATE USING (public.current_user_role_slug() = 'master');

-- Replace user_role_slug() with cache-based helper everywhere else (avoids reading profiles)
DROP POLICY IF EXISTS "organizations_select_master" ON public.organizations;
DROP POLICY IF EXISTS "organizations_select_own_org" ON public.organizations;
DROP POLICY IF EXISTS "organizations_insert_master" ON public.organizations;
DROP POLICY IF EXISTS "organizations_update_master" ON public.organizations;

CREATE POLICY "organizations_select_master" ON public.organizations
  FOR SELECT USING (public.current_user_role_slug() = 'master');

CREATE POLICY "organizations_select_own_org" ON public.organizations
  FOR SELECT USING (id = public.current_user_org_id());

CREATE POLICY "organizations_insert_master" ON public.organizations
  FOR INSERT WITH CHECK (public.current_user_role_slug() = 'master');

CREATE POLICY "organizations_update_master" ON public.organizations
  FOR UPDATE USING (public.current_user_role_slug() = 'master');

DROP POLICY IF EXISTS "roles_insert_master" ON public.roles;
DROP POLICY IF EXISTS "roles_update_master" ON public.roles;

CREATE POLICY "roles_insert_master" ON public.roles
  FOR INSERT WITH CHECK (public.current_user_role_slug() = 'master');

CREATE POLICY "roles_update_master" ON public.roles
  FOR UPDATE USING (public.current_user_role_slug() = 'master');

DROP POLICY IF EXISTS "brsr_visibility_select_master" ON public.brsr_questions_visibility;
DROP POLICY IF EXISTS "brsr_visibility_select_own_org" ON public.brsr_questions_visibility;
DROP POLICY IF EXISTS "brsr_visibility_insert_master" ON public.brsr_questions_visibility;
DROP POLICY IF EXISTS "brsr_visibility_update_master" ON public.brsr_questions_visibility;
DROP POLICY IF EXISTS "brsr_visibility_delete_master" ON public.brsr_questions_visibility;

CREATE POLICY "brsr_visibility_select_master" ON public.brsr_questions_visibility
  FOR SELECT USING (public.current_user_role_slug() = 'master');

CREATE POLICY "brsr_visibility_select_own_org" ON public.brsr_questions_visibility
  FOR SELECT USING (public.current_user_org_id() IS NOT NULL AND org_id = public.current_user_org_id() OR org_id IS NULL);

CREATE POLICY "brsr_visibility_insert_master" ON public.brsr_questions_visibility
  FOR INSERT WITH CHECK (public.current_user_role_slug() IN ('master', 'admin'));

CREATE POLICY "brsr_visibility_update_master" ON public.brsr_questions_visibility
  FOR UPDATE USING (public.current_user_role_slug() IN ('master', 'admin'));

CREATE POLICY "brsr_visibility_delete_master" ON public.brsr_questions_visibility
  FOR DELETE USING (public.current_user_role_slug() IN ('master', 'admin'));
