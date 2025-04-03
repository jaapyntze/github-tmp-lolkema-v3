/*
  # Add Admin Role to User

  1. Changes
    - Assigns admin role to specific user
    - Updates user metadata
    
  2. Security
    - Uses raw_app_meta_data for role storage
    - Safe update with specific user targeting
*/

-- Assign admin role to specific user
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  coalesce(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE id = '27618ad4-edfe-4199-9794-947694deac50';