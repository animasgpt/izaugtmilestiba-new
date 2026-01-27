import { Video, MapPin, Clock, CheckCircle } from "lucide-react";

interface ServicesSectionProps {
  onContactClick: () => void;
}

const ServicesSection = ({ onContactClick }: ServicesSectionProps) => {
  const services = [
    {
      icon: MapPin,
      title: "Konsultācijas klātienē",
      description: "Individuālas konsultācijas Rīgā, kur varam personiski pārrunāt jūsu ģimenes situāciju.",
      features: [
        "Personīga pieeja",
        "Draudzīga atmosfēra",
        "Individuāls risinājumu plāns"
      ]
    },
    {
      icon: Video,
      title: "Attālinātas konsultācijas",
      description: "Ērtas tiešsaistes konsultācijas, kas pieejamas no jebkuras vietas Latvijā un ārpus tās.",
      features: [
        "Zoom vai citas platformas",
        "Elastīgs laiks",
        "Bez ceļošanas laika"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pakalpojumi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Piedāvāju individuālas konsultācijas gan klātienē, gan attālināti. 
            Kopā atradīsim risinājumus tieši jūsu ģimenes situācijai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-border"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="font-semibold text-xl text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-6">
            <Clock className="w-5 h-5" />
            <span>Konsultācijas ilgums: ~60 minūtes</span>
          </div>
          
          <div className="block">
            <button
              onClick={onContactClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Pieteikties konsultācijai
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
