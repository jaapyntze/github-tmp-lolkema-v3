/*
  # Add Demo Data for Customer Portal

  1. Sample Data
    - Client data for testing
    - Sample invoices with different statuses
    - Precision operations with various types and metrics

  2. Notes
    - All data is linked to existing users
    - Includes realistic agricultural operations
    - Uses appropriate date ranges and amounts
*/

-- Insert demo client
INSERT INTO clients (id, user_id, company_name, contact_person, phone, address)
VALUES (
  'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
  '27618ad4-edfe-4199-9794-947694deac50',
  'Melkveebedrijf De Friese Weide',
  'Jan de Vries',
  '06-12345678',
  'Zuiderweg 123, 8448 AB Heerenveen'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo invoices
INSERT INTO invoices (client_id, invoice_number, amount, status, due_date, issued_date, pdf_url)
VALUES
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'INV-2024-001',
    2450.75,
    'paid',
    '2024-02-15',
    '2024-01-15',
    'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-1.pdf'
  ),
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'INV-2024-002',
    3750.00,
    'pending',
    '2024-03-20',
    '2024-02-20',
    'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-2.pdf'
  ),
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'INV-2024-003',
    1875.50,
    'overdue',
    '2024-03-01',
    '2024-02-01',
    'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/invoices/example-invoice-3.pdf'
  )
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
VALUES
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'Grasland Bemesting',
    'Perceel Noord - Heerenveen',
    '2024-03-10 08:00:00+00',
    '2024-03-10 17:30:00+00',
    ARRAY['John Deere 6155R', 'Schuitemaker Exacta 800', 'GPS RTK Systeem'],
    12.5,
    'Precisie bemesting uitgevoerd met variabele dosering op basis van biomassa kaarten',
    '{"gemiddelde_gift": "25 m³/ha", "dekking": "98%", "efficiency_score": "94%", "bodem_conditie": "optimaal"}'::jsonb
  ),
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'Mais Zaaien',
    'Perceel Oost - Heerenveen',
    '2024-03-15 07:30:00+00',
    '2024-03-15 19:00:00+00',
    ARRAY['John Deere 6215R', 'Monosem NG Plus 4', 'GPS RTK Systeem'],
    8.75,
    'Precisie zaai met variabele zaaidichtheid en automatische sectiecontrole',
    '{"zaaidichtheid": "95000 zaden/ha", "rijafstand": "75 cm", "zaaidiepte": "5.2 cm", "bodemtemperatuur": "12.5°C"}'::jsonb
  ),
  (
    'c81d4e2e-bcf2-4c1a-a7de-ac6a98b7d3f1',
    'Gras Maaien',
    'Perceel West - Heerenveen',
    '2024-03-20 06:00:00+00',
    '2024-03-20 16:00:00+00',
    ARRAY['John Deere 6195R', 'Kuhn FC 9530 D', 'GPS RTK Systeem'],
    15.3,
    'Eerste snede gemaaid met optimale maaihoogte voor snelle hergroei',
    '{"maaihoogte": "7 cm", "drogestof": "42%", "opbrengst": "4200 kg ds/ha", "snelheid": "12 km/u"}'::jsonb
  )
ON CONFLICT DO NOTHING;