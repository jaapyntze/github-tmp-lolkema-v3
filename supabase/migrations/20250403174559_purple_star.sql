/*
  # Add admin policy for creating users

  1. Changes
    - Add policy to allow admins to create users
    - Add policy to allow admins to manage client records
*/

-- Allow admins to create users
CREATE POLICY "Allow admins to create users"
ON auth.users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- Allow admins to manage clients
CREATE POLICY "Allow admins to manage clients"
ON clients
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  )
);