import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import type { ProductWithCategory } from '@/types/database'

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/cardapio/produto/${product.id}`)}
      className="bg-background rounded-xl border border-border p-4 text-left hover:border-foreground/20 transition-colors group"
    >
      <div className="flex gap-4">
        {product.image_url && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
          <p className="text-accent font-semibold mt-2">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
    </button>
  )
}
