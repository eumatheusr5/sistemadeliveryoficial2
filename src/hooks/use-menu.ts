import { useQuery } from '@tanstack/react-query'
import { 
  getActiveCategories, 
  getActiveProducts, 
  getMenuProductById,
  getMenuWithCategories,
  getFeaturedProducts,
  searchProducts,
} from '@/services/menu'

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: getActiveCategories,
  })
}

export function useMenuProducts() {
  return useQuery({
    queryKey: ['menu', 'products'],
    queryFn: getActiveProducts,
  })
}

export function useMenuProduct(id: string) {
  return useQuery({
    queryKey: ['menu', 'product', id],
    queryFn: () => getMenuProductById(id),
    enabled: !!id,
  })
}

export function useMenu() {
  return useQuery({
    queryKey: ['menu', 'full'],
    queryFn: getMenuWithCategories,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['menu', 'featured'],
    queryFn: getFeaturedProducts,
  })
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['menu', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2,
  })
}
