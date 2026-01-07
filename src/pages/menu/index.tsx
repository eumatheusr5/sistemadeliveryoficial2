import { useState, useMemo } from 'react'
import { Search, UtensilsCrossed } from 'lucide-react'
import { useMenu } from '@/hooks/use-menu'
import { CategoryNav } from '@/components/menu/category-nav'
import { ProductCard } from '@/components/menu/product-card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'

export function MenuPage() {
  const { data: menu, isLoading } = useMenu()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!menu) return []

    let products = menu.products

    if (activeCategory) {
      products = products.filter((p) => p.category_id === activeCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    return products
  }, [menu, activeCategory, searchQuery])

  if (isLoading) {
    return (
      <div>
        <div className="bg-background border-b border-border py-3">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CategoryNav
        categories={menu?.categories || []}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Nenhum produto encontrado"
            description="Tente buscar por outro termo ou categoria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
