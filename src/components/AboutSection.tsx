import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AboutSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Par mani
          </h2>
          <p className="font-serif text-lg text-muted-foreground leading-relaxed">
            Esmu sertificēta PEP (Parent Effectiveness Program) mamma un grāmatas 
            "Mammas sajūtu dienasgrāmata" autore. Mana misija ir palīdzēt vecākiem 
            veidot ciešākas, mīlošākas attiecības ar saviem bērniem, izmantojot 
            efektīvas komunikācijas un audzināšanas metodes.
          </p>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="font-serif text-lg px-8 py-3"
          >
            Lasi vairāk
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto font-serif">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-foreground">
                Par mani
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Es tiešām saprotu teicienu "Mēs bijām lieliski vecāki. Un tad mums piedzima bērns".
              </p>
              <p>
                Mana pieredze rāda, ka bērna ienākšana ģimenē izgaismo visu to, kas veiksmīgi maskēts un slēpts varbūt pat gadiem. (Neapzināti. Un arī pašam no sevis.) Un lai kā mēs gribētu sagatavoties mazuļa ienākšanai ģimenē, lai kādas grāmatas lasītu, lai kādus kursus apmeklētu, bērna piedzimšanai nav ekvivalenta - mēs varam mācīties, tikai ejot šai pieredzei cauri. Reiz, intervējot kādu tēti, viņš man teica - "Vecāku uzdevums ir "nofeilot". Jāpieņem, ka mēs kā mammas un tēti pieļausim kļūdas, jo mēs esam tikai cilvēki!" Un tā patiešām ir - mēs (un arī mūsu vecāki!) ikdienā darām uz 100% - no tiem laika, zināšanu, finansu resursiem, kas mums ir pieejami.
              </p>
              <p>
                Mēs mācāmies būt pietiekami labi vecāki visu dzīvi. Mēs mācāmies, ka bērniem nav vajadzīgi perfekti vecāki - tiem ir vajadzīgi mīloši vecāki. Un saviem bērniem mēs varam iedot tikai to, kas mums ir.
              </p>
              <p>
                Tieši tāpēc rūpes par otru sākas ar mūsu rūpēm pašiem par sevi.
              </p>
              <p>
                Projekts "Izaugt Mīlestībā" radies no manām pārdomām par vecāku lomu, no ikdienas situācijām, kurām pati gadu gaitā esmu meklējusi risinājumus. No savas vēlmes saprast un izzināt, no pieredzes, kas gūta. Man nepieder viena un īstā patiesība, es vienmēr saku - mums katram ir sava taisnība savā dzīvē. Esmu ceļā, kā daudzas mammas un tēti. Bet vienu es zinu droši - atbalstam, iedrošinājumam, nevērtējošai, pieņemošas līdzās būšanai ir ļoti liela nozīme, kļūstot par vecāku. Tieši tāpēc šobrīd mācos par PEP mammu - sievieti, kas ir līdzās mammai un pārim, ejot cauri izaicinājumu pilnajam ceļam ar mazuli.
              </p>
              <p>
                Reiz, intervējot bērnu ārstu, reanimatologu un domātāju Pēteri Kļavu, viņš man teica - "Bērns ir atbildība un iespējamība". Pēc laika es sapratu, ko viņš ar to domāja. Bērns ir iespēja, kas mums dota, izaugt mīlestībā - pret sevi, lai būtu labāks vecāks. Bērns ir iespēja mums katram izaugt. Mīlestībā.
              </p>
              <p className="text-foreground font-medium">
                Lai skaists un pateicības pilns ceļš,
              </p>
              <p className="text-foreground font-medium">
                Madara Pauzere.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default AboutSection;
