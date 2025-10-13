-- Create storage bucket for beverage labels
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'beverage-labels',
  'beverage-labels',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS policies for beverage-labels bucket
CREATE POLICY "Public can view beverage labels"
ON storage.objects FOR SELECT
USING (bucket_id = 'beverage-labels');

CREATE POLICY "Admins can upload beverage labels"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'beverage-labels' 
  AND is_admin(auth.uid())
);

CREATE POLICY "Admins can update beverage labels"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'beverage-labels' 
  AND is_admin(auth.uid())
);

CREATE POLICY "Admins can delete beverage labels"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'beverage-labels' 
  AND is_admin(auth.uid())
);