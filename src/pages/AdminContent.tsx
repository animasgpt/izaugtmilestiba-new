import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentEditor from "@/components/admin/ContentEditor";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminContent = () => {
  const navigate = useNavigate();
  const { isLoading: isAuthLoading, isAuthorized } = useAdminAuth();
  const { data: content, isLoading: contentLoading } = useSiteContent();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Group content by section
  const heroContent = content?.filter((item) => item.key.startsWith("hero_"));
  const aboutContent = content?.filter((item) => item.key.startsWith("about_"));
  const servicesContent = content?.filter((item) => item.key.startsWith("services_"));
  const bookContent = content?.filter((item) => item.key.startsWith("book_"));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-serif text-xl font-bold text-foreground">
            Satura rediģēšana
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {contentLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Hero Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                Galvenā sadaļa (Hero)
              </h2>
              <div className="space-y-4">
                {heroContent?.map((item) => (
                  <ContentEditor key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* About Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                Par mani
              </h2>
              <div className="space-y-4">
                {aboutContent?.map((item) => (
                  <ContentEditor key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Services Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                Pakalpojumi
              </h2>
              <div className="space-y-4">
                {servicesContent?.map((item) => (
                  <ContentEditor key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Book Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                Grāmata
              </h2>
              <div className="space-y-4">
                {bookContent?.map((item) => (
                  <ContentEditor key={item.id} item={item} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminContent;
