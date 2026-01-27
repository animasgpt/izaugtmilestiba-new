import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Lūdzu, ievadiet vārdu").max(100, "Vārds pārāk garš"),
  email: z.string().trim().email("Lūdzu, ievadiet derīgu e-pasta adresi").max(255, "E-pasts pārāk garš"),
  phone: z.string().trim().min(1, "Lūdzu, ievadiet telefona numuru").max(20, "Telefona numurs pārāk garš"),
  message: z.string().trim().max(1000, "Ziņojums pārāk garš").optional(),
  service_type: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message || null,
          service_type: data.service_type || null,
        });

      if (error) throw error;

      toast.success("Paldies! Jūsu ziņojums ir nosūtīts. Sazināšos ar jums drīzumā.");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Kļūda nosūtot ziņojumu. Lūdzu, mēģiniet vēlreiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sazinies ar mani
            </h2>
            <p className="text-lg text-muted-foreground">
              Aizpildiet formu, un es sazināšos ar jums, lai pārrunātu jūsu vajadzības.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card p-8 rounded-xl shadow-lg border border-border space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Vārds *</Label>
              <Input
                id="name"
                placeholder="Jūsu vārds"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-pasts *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jusu@epasts.lv"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefons *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+371 20000000"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Interesē</Label>
              <Select onValueChange={(value) => setValue("service_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Izvēlieties pakalpojumu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation-onsite">Konsultācija klātienē</SelectItem>
                  <SelectItem value="consultation-online">Attālināta konsultācija</SelectItem>
                  <SelectItem value="book">Grāmatas iegāde</SelectItem>
                  <SelectItem value="other">Cits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Ziņojums</Label>
              <Textarea
                id="message"
                placeholder="Pastāstiet vairāk par savu situāciju..."
                rows={4}
                {...register("message")}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Nosūta...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Nosūtīt
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
