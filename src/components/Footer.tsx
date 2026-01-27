import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg font-semibold text-primary">Izaugt mīlestībā</p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/izaugtmilestiba"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          <p className="font-serif text-muted-foreground text-sm flex items-center gap-1">
            Veidots ar <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>© {new Date().getFullYear()} Madara Pauzere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
