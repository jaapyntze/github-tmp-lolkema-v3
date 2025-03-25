/*
  # Customer Portal Schema

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company_name` (text)
      - `contact_person` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `invoices`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `invoice_number` (text)
      - `amount` (numeric)
      - `status` (text)
      - `due_date` (date)
      - `issued_date` (date)
      - `pdf_url` (text)
      - `created_at` (timestamp with time zone)

    - `precision_operations`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `operation_type` (text)
      - `location` (text)
      - `start_date` (timestamp with time zone)
      - `end_date` (timestamp with time zone)
      - `equipment_used` (text[])
      - `area_covered` (numeric)
      - `notes` (text)
      - `metrics` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add appropriate security policies
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  status text NOT NULL,
  due_date date NOT NULL,
  issued_date date NOT NULL,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Create precision_operations table
CREATE TABLE IF NOT EXISTS precision_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients NOT NULL,
  operation_type text NOT NULL,
  location text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  equipment_used text[] NOT NULL,
  area_covered numeric,
  notes text,
  metrics jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE precision_operations ENABLE ROW LEVEL SECURITY;

-- Policies for clients
CREATE POLICY "Users can view own client profile"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client profile"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for invoices
CREATE POLICY "Clients can view own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = invoices.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Policies for precision_operations
CREATE POLICY "Clients can view own operations"
  ON precision_operations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = precision_operations.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();