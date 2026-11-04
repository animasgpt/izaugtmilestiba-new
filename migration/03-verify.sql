-- Run in BOTH source and target. Compare counts and fingerprints before cutover.
SELECT 'site_content' AS name, count(*) AS rows,
  md5(coalesce(string_agg(jsonb_build_array(key, content, font_family, font_size)::text, '' ORDER BY key), '')) AS fingerprint
FROM public.site_content
UNION ALL
SELECT 'contact_submissions', count(*),
  md5(coalesce(string_agg(to_jsonb(c)::text, '' ORDER BY id), ''))
FROM public.contact_submissions c
UNION ALL
SELECT 'user_roles_by_email', count(*),
  md5(coalesce(string_agg(jsonb_build_array(lower(u.email), r.role)::text, '' ORDER BY lower(u.email), r.role), ''))
FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id;

-- All three must show row_security = true in the new database.
SELECT relname, relrowsecurity AS row_security FROM pg_class
WHERE oid IN ('public.site_content'::regclass, 'public.contact_submissions'::regclass, 'public.user_roles'::regclass);

-- Expected on a fresh project: true, true, false, false.
SELECT has_table_privilege('anon', 'public.site_content', 'SELECT') AS public_can_read_content,
  has_table_privilege('anon', 'public.contact_submissions', 'INSERT') AS public_can_submit,
  has_table_privilege('anon', 'public.contact_submissions', 'SELECT') AS public_can_read_contacts,
  has_table_privilege('anon', 'public.user_roles', 'SELECT') AS public_can_read_roles;
