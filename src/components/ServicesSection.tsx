import { MessageSquare, BookOpen } from "lucide-react";
import consultationOnsiteImg from "@/assets/consultation-onsite.jpg";
import consultationOnlineImg from "@/assets/consultation-online.jpg";
import bookImage from "@/assets/book-cover.jpg";

interface ServicesSectionProps {
  onContactClick: () => void;
}

const ServicesSection = ({ onContactClick }: ServicesSectionProps) => {
  const services = [
    {
      image: consultationOnsiteImg,
      icon: MessageSquare,
      title: "Konsultācija klātienē",
      description: "Individuāla saruna mājīgā vidē, veltot pilnu uzmanību Tev un Tavām sajūtām.",
      price: "50€",
    },
    {
      image: consultationOnlineImg,
      icon: MessageSquare,
      title: "Konsultācija online",
      description: "Ērts un pieejams atbalsts no jebkuras vietas, kur jūties vislabāk.",
      price: "35€",
    },
    {
      image: bookImage,
      icon: BookOpen,
      title: "Grāmata",
      description: "\"Mammas sajūtu dienasgrāmata\" – Tavs ceļvedis un atbalsts ikdienas gaitās.",
      price: "19.99€",
    },
  ];

  return (
    <section id="services" className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Tavam <span className="text-primary italic">atbalstam</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              {/* Image Container */}
              <div className="p-4 pb-0">
                <div className="bg-accent/70 rounded-xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="font-serif font-bold text-xl text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 flex-grow">
                  {service.description}
                </p>

                <p className="text-2xl font-bold text-foreground mb-6">
                  {service.price}
                </p>

                <button
                  onClick={onContactClick}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-all"
                >
                  Sazinies
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
