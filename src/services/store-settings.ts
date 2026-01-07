import { supabase } from '@/lib/supabase'

export interface StoreSettings {
  id: string
  store_name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  delivery_fee: number
  min_order_value: number
  is_open: boolean
  opening_hours: string | null
  created_at: string
  updated_at: string
}

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const { data: existing } = await supabase
    .from('store_settings')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('store_settings')
      .update(settings)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('store_settings')
    .insert(settings)
    .select()
    .single()

  if (error) throw error
  return data
}
