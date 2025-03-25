/*
  # Link Users to Company

  1. Create a new client record for the additional user
  2. Link to the same company details as the existing user
*/

-- Create client record for the new user with same company details
WITH existing_client AS (
  SELECT 
    company_name,
    contact_person,
    phone,
    address
  FROM clients 
  WHERE user_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'yj.jongsma@outlook.com'
    LIMIT 1
  )
)
INSERT INTO clients (
  user_id,
  company_name,
  contact_person,
  phone,
  address
)
SELECT
  (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1),
  company_name,
  contact_person,
  phone,
  address
FROM existing_client
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'emiel.lolkema@test.com'
);