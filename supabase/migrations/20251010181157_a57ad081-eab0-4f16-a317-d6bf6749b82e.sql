-- Create beverages table
CREATE TABLE public.beverages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('beer', 'wine', 'coffee', 'other')),
  brewery TEXT,
  abv NUMERIC,
  style TEXT,
  description TEXT,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create taps table
CREATE TABLE public.taps (
  id INTEGER PRIMARY KEY,
  beverage_id UUID REFERENCES public.beverages(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default 8 taps
INSERT INTO public.taps (id, is_active) VALUES
  (1, true), (2, true), (3, true), (4, true),
  (5, true), (6, true), (7, true), (8, true);

-- Create settings table (single row)
CREATE TABLE public.taplist_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  background_image TEXT,
  title TEXT DEFAULT 'On Tap',
  font_family TEXT,
  title_color TEXT,
  beverage_name_color TEXT,
  brewery_color TEXT,
  style_color TEXT,
  abv_color TEXT,
  description_color TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default settings
INSERT INTO public.taplist_settings (title) VALUES ('On Tap');

-- Enable Row Level Security
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taplist_settings ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no authentication needed)
CREATE POLICY "Public can view beverages" ON public.beverages FOR SELECT USING (true);
CREATE POLICY "Public can insert beverages" ON public.beverages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update beverages" ON public.beverages FOR UPDATE USING (true);
CREATE POLICY "Public can delete beverages" ON public.beverages FOR DELETE USING (true);

CREATE POLICY "Public can view taps" ON public.taps FOR SELECT USING (true);
CREATE POLICY "Public can update taps" ON public.taps FOR UPDATE USING (true);

CREATE POLICY "Public can view settings" ON public.taplist_settings FOR SELECT USING (true);
CREATE POLICY "Public can update settings" ON public.taplist_settings FOR UPDATE USING (true);

-- Enable realtime for cross-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.beverages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.taps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.taplist_settings;