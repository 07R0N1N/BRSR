-- Allow Master to delete organizations and roles (API enforces no delete of master/admin role).
-- Run after 002 in Supabase SQL Editor.

DROP POLICY IF EXISTS "organizations_delete_master" ON public.organizations;
CREATE POLICY "organizations_delete_master" ON public.organizations
  FOR DELETE USING (public.current_user_role_slug() = 'master');

DROP POLICY IF EXISTS "roles_delete_master" ON public.roles;
CREATE POLICY "roles_delete_master" ON public.roles
  FOR DELETE USING (public.current_user_role_slug() = 'master');
