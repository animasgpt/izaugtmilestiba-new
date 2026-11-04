-- Run in the OLD database SQL Editor with administrative access.
-- Copy the FULL migration_sql cell (not CSV quoting) into a private .sql file.
-- Run it in the NEW database AFTER 01-schema.sql and creating Auth users.
-- Includes personal data. Do not commit the result. The source stays unchanged.
WITH snapshots AS (
  SELECT
    (SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY key), '[]'::jsonb) FROM public.site_content s) AS content,
    (SELECT coalesce(jsonb_agg(to_jsonb(c) ORDER BY id), '[]'::jsonb) FROM public.contact_submissions c) AS contacts,
    (SELECT coalesce(jsonb_agg(jsonb_build_object('email', u.email, 'role', r.role) ORDER BY u.email, r.role), '[]'::jsonb)
       FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id) AS roles
)
SELECT 'BEGIN;' || chr(10) ||
  format('INSERT INTO public.site_content SELECT * FROM jsonb_populate_recordset(NULL::public.site_content, %L::jsonb) ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, font_family = EXCLUDED.font_family, font_size = EXCLUDED.font_size, created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at;', content::text) || chr(10) ||
  format('INSERT INTO public.contact_submissions SELECT * FROM jsonb_populate_recordset(NULL::public.contact_submissions, %L::jsonb) ON CONFLICT (id) DO NOTHING;', contacts::text) || chr(10) ||
  format('DO %L;', format(
    'BEGIN IF EXISTS (SELECT 1 FROM jsonb_to_recordset(%L::jsonb) AS r(email text, role text) WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(r.email))) THEN RAISE EXCEPTION ''Create all source role holders in Authentication > Users first, using the same emails, then rerun import.''; END IF; END;', roles::text)) || chr(10) ||
  format('INSERT INTO public.user_roles (user_id, role) SELECT u.id, r.role::public.app_role FROM jsonb_to_recordset(%L::jsonb) AS r(email text, role text) JOIN auth.users u ON lower(u.email) = lower(r.email) ON CONFLICT (user_id, role) DO NOTHING;', roles::text) || chr(10) ||
  'COMMIT;' AS migration_sql
FROM snapshots;

-- Run separately to find Auth users to recreate:
-- SELECT u.email, r.role FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id;
