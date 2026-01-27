import { Heart, Users, BookOpen } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Par mani
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Esmu sertificēta PEP (Parent Effectiveness Program) mamma un grāmatas 
            "Mammas sajūtu dienasgrāmata" autore. Mana misija ir palīdzēt vecākiem 
            veidot ciešākas, mīlošākas attiecības ar saviem bērniem, izmantojot 
            efektīvas komunikācijas un audzināšanas metodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-xl text-foreground mb-3">
              Mīloša pieeja
            </h3>
            <p className="text-muted-foreground">
              Palīdzu vecākiem atrast ceļu uz bērnu sirdīm ar mīlestību un sapratni.
            </p>
          </div>

          <div className="bg-background p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-xl text-foreground mb-3">
              PEP metode
            </h3>
            <p className="text-muted-foreground">
              Sertificēta Parent Effectiveness Program trenere ar praktisku pieredzi.
            </p>
          </div>

          <div className="bg-background p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-xl text-foreground mb-3">
              Grāmatas autore
            </h3>
            <p className="text-muted-foreground">
              "Mammas sajūtu dienasgrāmata" - ceļvedis ikvienai mammai.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
