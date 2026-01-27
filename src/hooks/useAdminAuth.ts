import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UseAdminAuthOptions {
  redirectTo?: string;
}

interface AdminAuthState {
  isLoading: boolean;
  isAuthorized: boolean;
  userId: string | null;
}

/**
 * Centralized hook for admin authorization.
 * 
 * Security Note: This hook performs client-side authorization checks.
 * The database is protected by RLS policies using the has_role() function,
 * which provides server-side enforcement. This client-side check is for
 * UX purposes (redirecting unauthorized users) rather than security.
 * 
 * The actual security is provided by:
 * 1. RLS policies on all admin-accessible tables
 * 2. The has_role() SECURITY DEFINER function
 * 3. Supabase Auth session validation
 */
export const useAdminAuth = (options: UseAdminAuthOptions = {}) => {
  const { redirectTo = "/admin-login" } = options;
  const [state, setState] = useState<AdminAuthState>({
    isLoading: true,
    isAuthorized: false,
    userId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (mounted) {
            setState({ isLoading: false, isAuthorized: false, userId: null });
            navigate(redirectTo);
          }
          return;
        }

        // Check admin role using RLS-protected query
        // This query will only succeed if the user has the admin role
        // due to the RLS policy on user_roles table
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) {
          console.error("Error checking admin role:", error);
          if (mounted) {
            await supabase.auth.signOut();
            setState({ isLoading: false, isAuthorized: false, userId: null });
            navigate(redirectTo);
          }
          return;
        }

        if (!roles) {
          if (mounted) {
            await supabase.auth.signOut();
            setState({ isLoading: false, isAuthorized: false, userId: null });
            navigate(redirectTo);
          }
          return;
        }

        if (mounted) {
          setState({
            isLoading: false,
            isAuthorized: true,
            userId: session.user.id,
          });
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        if (mounted) {
          setState({ isLoading: false, isAuthorized: false, userId: null });
          navigate(redirectTo);
        }
      }
    };

    checkAdminAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (mounted) {
          setState({ isLoading: false, isAuthorized: false, userId: null });
          navigate(redirectTo);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...state,
    signOut,
  };
};
