/*
  # Blog System Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, required)
      - `excerpt` (text, required)
      - `content` (text, required)
      - `image_url` (text, required)
      - `category` (text, required)
      - `read_time` (text, required)
      - `author_id` (uuid, references auth.users)
      - `published` (boolean, default false)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for:
      - Anyone can read published posts
      - Authenticated users can manage their own posts
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  read_time text NOT NULL,
  author_id uuid REFERENCES auth.users NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
-- Allow anyone to read published posts
CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

-- Allow authenticated users to read their own posts (published or not)
CREATE POLICY "Users can read own posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

-- Allow authenticated users to insert their own posts
CREATE POLICY "Users can create own posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Allow authenticated users to update their own posts
CREATE POLICY "Users can update own posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Allow authenticated users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE
  ON blog_posts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();