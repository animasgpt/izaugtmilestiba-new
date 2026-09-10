import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";

export interface SanitySiteSettings {
  heroTitle?: string;
  intro?: string;
  email?: string;
  phone?: string;
  inPersonPrice?: string;
  onlinePrice?: string;
  journalPrice?: string;
}

export const useSanitySiteSettings = () => {
  return useQuery({
    queryKey: ["sanity-site-settings"],
    queryFn: async () => {
      const data = await sanityClient.fetch<SanitySiteSettings | null>(
        `*[_type == "siteSettings"][0]{ heroTitle, intro, email, phone, inPersonPrice, onlinePrice, journalPrice }`
      );
      return data;
    },
    staleTime: 60_000,
    retry: 1,
  });
};
