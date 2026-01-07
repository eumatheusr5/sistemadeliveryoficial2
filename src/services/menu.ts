import { supabase } from '@/lib/supabase'
import type { 
  Category, 
  ProductWithCategory,
  ProductWithComplementGroups,
} from '@/types/database'

export interface MenuCategory extends Category {
  products: ProductWithCategory[]
}

export async function getActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function getActiveProducts(): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .order('name', { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

export async function getMenuProductById(id: string): Promise<ProductWithComplementGroups> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_complement_groups(
        sort_order,
        complement_group:complement_groups(
          *,
          complements(*)
        )
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) throw error

  const product = data as ProductWithComplementGroups
  if (product.product_complement_groups) {
    product.product_complement_groups = product.product_complement_groups
      .filter(pcg => pcg.complement_group?.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(pcg => ({
        ...pcg,
        complement_group: {
          ...pcg.complement_group,
          complements: pcg.complement_group.complements
            .filter(c => c.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
        }
      }))
  }

  return product
}

export async function getMenuWithCategories(): Promise<MenuCategory[]> {
  const categories = await getActiveCategories()
  const products = await getActiveProducts()

  const menuCategories = categories.map(category => ({
    ...category,
    products: products.filter(p => p.category_id === category.id)
  })).filter(cat => cat.products.length > 0)

  return menuCategories
}

export async function searchProducts(query: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}
