import { supabase } from '@/lib/supabase'
import type {
  ComplementGroup,
  ComplementGroupInsert,
  ComplementGroupUpdate,
  ComplementGroupWithComplements,
  Complement,
  ComplementInsert,
  ComplementUpdate,
  ProductComplementGroupInsert,
} from '@/types/database'

export async function getComplementGroups() {
  const { data, error } = await supabase
    .from('complement_groups')
    .select(`
      *,
      complements(*)
    `)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data as ComplementGroupWithComplements[]
}

export async function getComplementGroupById(id: string) {
  const { data, error } = await supabase
    .from('complement_groups')
    .select(`
      *,
      complements(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ComplementGroupWithComplements
}

export async function createComplementGroup(group: ComplementGroupInsert) {
  const { data, error } = await supabase
    .from('complement_groups')
    .insert(group)
    .select()
    .single()

  if (error) throw error
  return data as ComplementGroup
}

export async function updateComplementGroup(id: string, group: ComplementGroupUpdate) {
  const { data, error } = await supabase
    .from('complement_groups')
    .update(group)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ComplementGroup
}

export async function deleteComplementGroup(id: string) {
  const { error } = await supabase
    .from('complement_groups')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getComplementsByGroupId(groupId: string) {
  const { data, error } = await supabase
    .from('complements')
    .select('*')
    .eq('complement_group_id', groupId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data as Complement[]
}

export async function createComplement(complement: ComplementInsert) {
  const { data, error } = await supabase
    .from('complements')
    .insert(complement)
    .select()
    .single()

  if (error) throw error
  return data as Complement
}

export async function updateComplement(id: string, complement: ComplementUpdate) {
  const { data, error } = await supabase
    .from('complements')
    .update(complement)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Complement
}

export async function deleteComplement(id: string) {
  const { error } = await supabase
    .from('complements')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function uploadComplementImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('complements')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('complements')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteComplementImage(imageUrl: string) {
  const urlParts = imageUrl.split('/complements/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]
  
  const { error } = await supabase.storage
    .from('complements')
    .remove([filePath])

  if (error) throw error
}

export interface ProductComplementGroupWithDetails {
  id: string
  product_id: string
  complement_group_id: string
  sort_order: number
  created_at: string
  complement_group: ComplementGroupWithComplements
}

export async function getProductComplementGroups(productId: string): Promise<ProductComplementGroupWithDetails[]> {
  const { data, error } = await supabase
    .from('product_complement_groups')
    .select(`
      *,
      complement_group:complement_groups(
        *,
        complements(*)
      )
    `)
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as ProductComplementGroupWithDetails[]
}

export async function linkComplementGroupToProduct(data: ProductComplementGroupInsert) {
  const { error } = await supabase
    .from('product_complement_groups')
    .insert(data)

  if (error) throw error
}

export async function unlinkComplementGroupFromProduct(productId: string, complementGroupId: string) {
  const { error } = await supabase
    .from('product_complement_groups')
    .delete()
    .eq('product_id', productId)
    .eq('complement_group_id', complementGroupId)

  if (error) throw error
}

export async function updateProductComplementGroups(productId: string, groupIds: string[]) {
  const { error: deleteError } = await supabase
    .from('product_complement_groups')
    .delete()
    .eq('product_id', productId)

  if (deleteError) throw deleteError

  if (groupIds.length > 0) {
    const links = groupIds.map((groupId, index) => ({
      product_id: productId,
      complement_group_id: groupId,
      sort_order: index,
    }))

    const { error: insertError } = await supabase
      .from('product_complement_groups')
      .insert(links)

    if (insertError) throw insertError
  }
}

export async function getProductsByComplementGroup(complementGroupId: string) {
  const { data, error } = await supabase
    .from('product_complement_groups')
    .select(`
      product:products(
        id,
        name,
        category:categories(name)
      )
    `)
    .eq('complement_group_id', complementGroupId)

  if (error) throw error
  return data?.map(d => d.product).filter(Boolean) ?? []
}
