import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  read_time: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  issued_date: string;
  pdf_url: string | null;
  created_at: string;
};

export type PrecisionOperation = {
  id: string;
  client_id: string;
  operation_type: string;
  location: string;
  start_date: string;
  end_date: string | null;
  equipment_used: string[];
  area_covered: number | null;
  notes: string | null;
  metrics: Record<string, any> | null;
  created_at: string;
};