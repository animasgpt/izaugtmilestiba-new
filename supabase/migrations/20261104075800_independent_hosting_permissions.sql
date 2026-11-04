REVOKE ALL ON public.site_content, public.contact_submissions, public.user_roles FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- Explicit grants for projects without automatic Data API grants; RLS still applies.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT ON public.contact_submissions, public.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content, public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
