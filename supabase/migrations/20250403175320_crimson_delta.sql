/*
  # Update Client Table Policies

  1. Changes
    - Add policy for admins to view all clients
    - Keep existing policy for regular users to view their own data
    
  2. Security
    - Admins can view and manage all clients
    - Regular users can only view their own data
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own client profile" ON clients;
DROP POLICY IF EXISTS "Users can update own client profile" ON clients;
DROP POLICY IF EXISTS "Allow admins to manage clients" ON clients;

-- Policy for regular users to view their own profile
CREATE POLICY "Users can view own client profile"
ON clients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- Policy for regular users to update their own profile
CREATE POLICY "Users can update own client profile"
ON clients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- Policy for admins to manage all clients
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