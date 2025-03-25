/*
  # Add New Demo Data

  1. New Data
    - Add 2 unpaid invoices
    - Add 1 planned operation
    
  2. Data Structure
    - Invoices include payment status, due dates, and amounts
    - Operation includes equipment details and planned metrics
*/

-- Insert new unpaid invoices
INSERT INTO invoices (client_id, invoice_number, amount, status, due_date, issued_date, pdf_url)
SELECT
  c.id,
  'INV-2024-006',
  5675.25,
  'overdue',
  '2024-03-25',
  '2024-02-25',
  'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-6.pdf'
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (client_id, invoice_number, amount, status, due_date, issued_date, pdf_url)
SELECT
  c.id,
  'INV-2024-007',
  3890.50,
  'pending',
  '2024-04-20',
  '2024-03-20',
  'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-7.pdf'
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert new planned operation
INSERT INTO precision_operations (
  client_id,
  operation_type,
  location,
  start_date,
  end_date,
  equipment_used,
  area_covered,
  notes,
  metrics
)
SELECT
  c.id,
  'Mais Zaaien',
  'Perceel Oost - Tijnje',
  '2024-04-25 07:00:00+00',
  NULL, -- Planned operation
  ARRAY['John Deere 6215R', 'Monosem NG Plus 4', 'GPS RTK Systeem'],
  16.8,
  'Precisie zaai met variabele zaaidichtheid en automatische sectiecontrole',
  jsonb_build_object(
    'geplande_zaaidichtheid', '95000 zaden/ha',
    'rijafstand', '75 cm',
    'streef_zaaidiepte', '5 cm',
    'minimale_bodemtemperatuur', '12°C'
  )
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT DO NOTHING;