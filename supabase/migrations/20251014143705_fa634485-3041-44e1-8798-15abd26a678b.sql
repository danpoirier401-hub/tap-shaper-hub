-- Add individual font columns to taplist_settings
ALTER TABLE public.taplist_settings
  ADD COLUMN IF NOT EXISTS title_font TEXT,
  ADD COLUMN IF NOT EXISTS beverage_name_font TEXT,
  ADD COLUMN IF NOT EXISTS brewery_font TEXT,
  ADD COLUMN IF NOT EXISTS style_font TEXT,
  ADD COLUMN IF NOT EXISTS abv_font TEXT,
  ADD COLUMN IF NOT EXISTS description_font TEXT;