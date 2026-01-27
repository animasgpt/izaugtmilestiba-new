import bookImage from "@/assets/book-cover.jpg";
import { BookOpen, Heart, Sparkles } from "lucide-react";

interface BookSectionProps {
  onContactClick: () => void;
}

const BookSection = ({ onContactClick }: BookSectionProps) => {
  const highlights = [
    {
      icon: Heart,
      text: "Sirsnīgi stāsti par mātes pieredzi"
    },
    {
      icon: BookOpen,
      text: "Praktiskas atziņas ikdienai"
    },
    {
      icon: Sparkles,
      text: "Iedvesma un atbalsts mammām"
    }
  ];

  return (
    <section id="book" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Book Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto">
              <img
                src={bookImage}
                alt="Mammas sajūtu dienasgrāmata - grāmata"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -z-10 -bottom-4 -left-4 w-full h-full bg-primary/10 rounded-xl" />
          </div>

          {/* Book Info */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Mammas sajūtu dienasgrāmata
            </h2>
            
            <p className="font-serif text-lg text-muted-foreground leading-relaxed">
              Šī grāmata ir mans sirds darbs — personīgi stāsti, pārdomas un atziņas 
              par mātes lomu, bērnu audzināšanu un ikdienas izaicinājumiem. Tā ir 
              domāta ikvienai mammai, kas meklē atbalstu un sapratni.
            </p>

            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-serif text-foreground">{highlight.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="font-serif text-muted-foreground mb-4">
                Lai iegādātos grāmatu, lūdzu, sazinieties ar mani.
              </p>
              <button
                onClick={onContactClick}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-serif font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Pasūtīt grāmatu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
