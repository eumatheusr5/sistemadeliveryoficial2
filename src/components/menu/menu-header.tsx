import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Store } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'

export function MenuHeader() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/cardapio" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-accent" />
          <span className="font-semibold text-lg">DeliveryPro</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={() => navigate('/cardapio/carrinho')}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Carrinho
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
