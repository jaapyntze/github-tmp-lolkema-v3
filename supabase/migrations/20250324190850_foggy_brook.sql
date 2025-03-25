/*
  # Customer Portal Schema Update

  1. Tables
    - Ensures clients, invoices, and precision_operations tables exist
    - Adds appropriate columns and constraints
  
  2. Security
    - Enables RLS on all tables
    - Adds policies with existence checks
    - Sets up updated_at trigger
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

-- Safely create policies with existence checks
DO $$
BEGIN
    -- Clients policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' 
        AND policyname = 'Users can view own client profile'
    ) THEN
        CREATE POLICY "Users can view own client profile"
        ON clients
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' 
        AND policyname = 'Users can update own client profile'
    ) THEN
        CREATE POLICY "Users can update own client profile"
        ON clients
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Invoices policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'invoices' 
        AND policyname = 'Clients can view own invoices'
    ) THEN
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
    END IF;

    -- Precision operations policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'precision_operations' 
        AND policyname = 'Clients can view own operations'
    ) THEN
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
    END IF;
END
$$;

-- Create or replace updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_clients_updated_at'
    ) THEN
        CREATE TRIGGER update_clients_updated_at
        BEFORE UPDATE ON clients
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;