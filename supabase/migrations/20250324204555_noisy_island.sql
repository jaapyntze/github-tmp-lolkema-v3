/*
  # Remove One Operation

  1. Changes
    - Remove the 'Grondbewerking' operation from precision_operations table
    
  2. Security
    - Uses existing RLS policies
    - Safe deletion with specific criteria
*/

-- Delete the 'Grondbewerking' operation for the specified client
DELETE FROM precision_operations
WHERE operation_type = 'Grondbewerking'
AND client_id IN (
  SELECT id 
  FROM clients 
  WHERE user_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'emiel.lolkema@test.com'
    LIMIT 1
  )
);