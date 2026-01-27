import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteContent {
  id: string;
  key: string;
  content: string;
  font_family: string;
  font_size: string;
  created_at: string;
  updated_at: string;
}

export const useSiteContent = () => {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

export const useContentByKey = (key: string) => {
  const { data: allContent } = useSiteContent();
  return allContent?.find((item) => item.key === key);
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      font_family,
      font_size,
    }: {
      id: string;
      content: string;
      font_family: string;
      font_size: string;
    }) => {
      const { data, error } = await supabase
        .from("site_content")
        .update({ content, font_family, font_size })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Saturs saglabāts");
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast.error("Kļūda saglabājot saturu");
    },
  });
};
