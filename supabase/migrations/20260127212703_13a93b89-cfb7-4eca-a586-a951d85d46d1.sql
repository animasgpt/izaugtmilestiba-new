-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for editable site content
CREATE TABLE public.site_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    font_family TEXT DEFAULT 'Lato',
    font_size TEXT DEFAULT '16px',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read content
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can update content
CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert content
CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete content
CREATE POLICY "Admins can delete site content"
ON public.site_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_content (key, content, font_family, font_size) VALUES
('hero_title', 'Izaugt mīlestībā', 'Playfair Display', '48px'),
('hero_quote', 'Atbalsts, kļūstot par vecākiem.', 'Lato', '20px'),
('hero_subtitle_1', 'Sertificēta PEP mamma,', 'Lato', '16px'),
('hero_subtitle_2', '"Mammas sajūtu dienasgrāmata" autore', 'Lato', '16px'),
('hero_author', 'Madara Pauzere', 'Lato', '18px'),
('about_title', 'Par mani', 'Playfair Display', '36px'),
('about_description', 'Esmu sertificēta PEP (Parent Effectiveness Program) mamma un grāmatas "Mammas sajūtu dienasgrāmata" autore. Mana misija ir palīdzēt vecākiem veidot ciešākas, mīlošākas attiecības ar saviem bērniem, izmantojot efektīvas komunikācijas un audzināšanas metodes.', 'Lato', '18px'),
('services_title', 'Tavam atbalstam', 'Playfair Display', '36px'),
('book_title', 'Mammas sajūtu dienasgrāmata', 'Playfair Display', '36px'),
('book_description', 'Šī grāmata ir mans sirds darbs — personīgi stāsti, pārdomas un atziņas par mātes lomu, bērnu audzināšanu un ikdienas izaicinājumiem. Tā ir domāta ikvienai mammai, kas meklē atbalstu un sapratni.', 'Lato', '18px');