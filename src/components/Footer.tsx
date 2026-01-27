import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg font-semibold text-primary">
            Izaugt Mīlestībā
          </p>
          
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Veidots ar <Heart className="w-4 h-4 text-primary fill-primary" /> 
            <span>© {new Date().getFullYear()} Madara Pauzere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
