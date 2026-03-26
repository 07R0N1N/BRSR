-- Rename system role Normal → User (display name + slug). Keeps same row id for FK integrity.
UPDATE public.roles
SET name = 'User', slug = 'user'
WHERE slug = 'normal';
