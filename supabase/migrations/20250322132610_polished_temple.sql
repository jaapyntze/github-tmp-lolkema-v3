/*
  # Storage setup for blog images

  1. Storage Configuration
    - Create public bucket for blog images
    - Enable public access to uploaded files
  
  2. Security
    - Enable policies for authenticated users to:
      - Upload images to blog-images folder
      - Read all images
      - Delete their own images
    - Enable public read access for published blog images
*/

-- Create public bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('public', 'public', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'public' AND 
  name LIKE 'blog-images/%'
);

-- Policy to allow authenticated users to read all images
CREATE POLICY "Allow authenticated read"
ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'public');

-- Policy to allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated delete own"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'public' AND
  name LIKE 'blog-images/%' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public read access to published blog images
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'public' AND
  name LIKE 'blog-images/%'
);