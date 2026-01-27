import heroImage from "@/assets/hero-madara.jpg";

interface HeroSectionProps {
  onContactClick: () => void;
}

const HeroSection = ({ onContactClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="min-h-screen pt-20 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Izaugt mīlestībā
            </h1>

            <p className="font-serif text-lg md:text-xl text-secondary font-medium italic">Atbalsts, kļūstot par vecākiem.</p>

            <div className="space-y-1 font-serif">
              <p className="text-foreground text-lg">Madara Pauzere</p>
              <p className="text-muted-foreground">Divu dēlu mamma,</p>
              <p className="text-muted-foreground">Sertificēta PEP mamma,</p>
              <p className="text-muted-foreground">Izdevuma "Mammas sajūtu dienasgrāmata" radītāja</p>
              <p className="text-muted-foreground">
                Žurnālgrāmatu "Bērniņu gaidot", "Mūsu zīdainis", "Mūsu bērns. 2-3 gadi" veidotāja.
              </p>
            </div>

            <button
              onClick={onContactClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-serif font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sazinies ar mani
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt="Madara Pauzere - PEP mamma" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-primary/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
