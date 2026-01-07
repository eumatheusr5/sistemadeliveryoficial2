import { supabase } from '@/lib/supabase'

export interface StoreSettings {
  id: string
  name: string
  description: string | null
  logo_url: string | null
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

export async function updateStoreSettings(
  id: string,
  data: Partial<Pick<StoreSettings, 'name' | 'description' | 'logo_url'>>
): Promise<StoreSettings> {
  const { data: updated, error } = await supabase
    .from('store_settings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return updated
}

export async function createStoreSettings(
  data: Pick<StoreSettings, 'name'> & Partial<Pick<StoreSettings, 'description' | 'logo_url'>>
): Promise<StoreSettings> {
  const { data: created, error } = await supabase
    .from('store_settings')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return created
}

export async function uploadStoreLogo(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `logo-${Date.now()}.${fileExt}`
  const filePath = `store/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('images').getPublicUrl(filePath)
  return data.publicUrl
}

export async function deleteStoreLogo(url: string): Promise<void> {
  const path = url.split('/images/')[1]
  if (path) {
    await supabase.storage.from('images').remove([path])
  }
}
