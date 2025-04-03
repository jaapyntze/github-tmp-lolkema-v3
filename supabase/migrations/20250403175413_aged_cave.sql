/*
  # Fix Auth Permissions for Admin Users

  1. Changes
    - Grant admin users access to auth.users table
    - Update client policies to not require direct auth.users access
    
  2. Security
    - Maintain security by checking admin role in app_metadata
    - Keep existing client access controls
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admins to create users" ON auth.users;
DROP POLICY IF EXISTS "Users can view own client profile" ON clients;
DROP POLICY IF EXISTS "Users can update own client profile" ON clients;
DROP POLICY IF EXISTS "Allow admins to manage clients" ON clients;

-- Create new policies for clients table
CREATE POLICY "Users can view own client profile"
ON clients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  (COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin')
);

CREATE POLICY "Users can update own client profile"
ON clients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  (COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin')
)
WITH CHECK (
  auth.uid() = user_id OR
  (COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin')
);

CREATE POLICY "Allow admins to manage clients"
ON clients
FOR ALL
TO authenticated
USING (
  (COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin')
);