/*
  # Add Demo Data for Invoices and Operations

  1. Demo Data
    - Add sample invoices with different statuses and amounts
    - Add sample precision operations with detailed metrics
    - Link all data to existing client records

  2. Data Structure
    - Invoices include payment status, due dates, and amounts
    - Operations include equipment used, area covered, and detailed metrics
*/

-- Insert demo invoices for existing clients
INSERT INTO invoices (client_id, invoice_number, amount, status, due_date, issued_date, pdf_url)
SELECT
  c.id,
  'INV-2024-004',
  4850.75,
  'pending',
  '2024-04-15',
  '2024-03-15',
  'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-4.pdf'
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (client_id, invoice_number, amount, status, due_date, issued_date, pdf_url)
SELECT
  c.id,
  'INV-2024-005',
  3275.50,
  'paid',
  '2024-03-30',
  '2024-03-01',
  'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-5.pdf'
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert demo precision operations
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
  'Sleepslang Bemesting',
  'Perceel Zuid - Tijnje',
  '2024-04-05 07:00:00+00',
  '2024-04-05 18:00:00+00',
  ARRAY['Vervaet Hydro Trike', 'Sleepslang systeem 24m', 'GPS RTK Systeem'],
  22.5,
  'Bemesting uitgevoerd met sleepslang systeem voor minimale bodemverdichting',
  jsonb_build_object(
    'gemiddelde_gift', '35 m³/ha',
    'werkbreedte', '24 meter',
    'bodemvochtigheid', '65%',
    'weer_condities', 'Droog, 12°C'
  )
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT DO NOTHING;

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
  'Gras Inkuilen',
  'Perceel Noord - Tijnje',
  '2024-04-10 08:00:00+00',
  NULL, -- Still ongoing/planned
  ARRAY['John Deere 8400i', 'Schuitemaker Rapide 580', 'Kuhn Merge Maxx 950'],
  18.7,
  'Eerste snede inkuilen met focus op optimale droge stof percentage',
  jsonb_build_object(
    'drogestof_percentage', '45%',
    'opbrengst', '4500 kg ds/ha',
    'snijlengte', '35 mm',
    'inkuilmiddel', 'Pioneer 11G22'
  )
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT DO NOTHING;

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
  'Grondbewerking',
  'Perceel West - Tijnje',
  '2024-04-15 06:30:00+00',
  NULL, -- Planned operation
  ARRAY['John Deere 6250R', 'Lemken Karat 12', 'GPS RTK Systeem'],
  15.3,
  'Voorjaarsgrondbewerking voor optimale zaaibedbereiding',
  jsonb_build_object(
    'werkdiepte', '25 cm',
    'bodemtype', 'Zandgrond',
    'organische_stof', '4.2%',
    'brandstofverbruik', '12.5 l/ha'
  )
FROM clients c
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'emiel.lolkema@test.com' LIMIT 1)
ON CONFLICT DO NOTHING;