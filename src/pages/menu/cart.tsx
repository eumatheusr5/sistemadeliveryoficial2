import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { QuantitySelector } from '@/components/menu/quantity-selector'
import { EmptyState } from '@/components/layout/empty-state'
import { formatCurrency } from '@/lib/utils'

export function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cardapio')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao cardápio
        </button>

        <EmptyState
          icon={ShoppingBag}
          title="Carrinho vazio"
          description="Adicione produtos do cardápio para continuar."
        >
          <Button onClick={() => navigate('/cardapio')}>
            Ver Cardápio
          </Button>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="pb-32">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cardapio')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </button>

        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-background rounded-xl border border-border p-4"
            >
              <div className="flex gap-4">
                {item.product.image_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      {item.complements.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {item.complements.map((c) => c.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-muted-foreground italic">Obs: {item.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      min={1}
                      size="sm"
                    />
                    <p className="font-semibold text-accent">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-bold">{formatCurrency(getTotal())}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/cardapio/checkout')}>
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  )
}
