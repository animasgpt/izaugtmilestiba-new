import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Mail, Phone, User, Calendar, MessageSquare, Tag, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  service_type: string | null;
  created_at: string;
}

const serviceTypeLabels: { [key: string]: string } = {
  "consultation-onsite": "Konsultācija klātienē",
  "consultation-online": "Attālināta konsultācija",
  "book": "Grāmatas iegāde",
  "other": "Cits",
};

const Admin = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin-login");
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        await supabase.auth.signOut();
        navigate("/admin-login");
        return;
      }

      fetchSubmissions();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin-login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Kļūda ielādējot datus");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Veiksmīgi izrakstījies");
    navigate("/admin-login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("lv-LV", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-foreground">
            Administrācijas panelis
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Izrakstīties
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Kontaktformas pieteikumi
            </h2>
            <p className="text-muted-foreground mt-1">
              Kopā: {submissions.length} pieteikumi
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground">Nav neviena pieteikuma</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Vārds
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-pasts
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefons
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Pakalpojums
                      </div>
                    </TableHead>
                    <TableHead className="max-w-[300px]">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ziņojums
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Datums
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-primary hover:underline"
                        >
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-primary hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        {submission.service_type
                          ? serviceTypeLabels[submission.service_type] || submission.service_type
                          : "-"}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="truncate" title={submission.message || ""}>
                          {submission.message || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(submission.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
