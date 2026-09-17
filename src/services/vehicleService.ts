import { supabase } from '../lib/supabaseClient';

export interface Vehicle {
  id: string;
  stock_code: string;
  year: number;
  make: string;
  model: string;
  derivative?: string | null;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  images: string[];
  estimated_installment?: number | null;
  available?: boolean;
}

interface VehicleFilters {
  model?: string;
  transmission?: string;
}

export async function getVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  let query = supabase
    .from('plm_vehicles')
    .select('*')
    .eq('available', true)
    .order('year', { ascending: false });

  if (filters.model && filters.model !== 'All') {
    query = query.ilike('model', `%${filters.model}%`);
  }

  if (filters.transmission && filters.transmission !== 'All') {
    query = query.eq('transmission', filters.transmission);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load PLM vehicle inventory:', error);
    return [];
  }

  return (data ?? []) as Vehicle[];
}
