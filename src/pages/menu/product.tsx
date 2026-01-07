import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useProductWithComplements } from '@/hooks/use-menu'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { QuantitySelector } from '@/components/menu/quantity-selector'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Complement, ComplementGroupWithComplements } from '@/types/database'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProductWithComplements(id!)
  const addItem = useCartStore((state) => state.addItem)

  const [quantity, setQuantity] = useState(1)
  const [selectedComplements, setSelectedComplements] = useState<Record<string, Complement[]>>({})
  const [notes, setNotes] = useState('')

  function toggleComplement(group: ComplementGroupWithComplements, complement: Complement) {
    setSelectedComplements((prev) => {
      const current = prev[group.id] || []
      const exists = current.find((c) => c.id === complement.id)

      if (exists) {
        return { ...prev, [group.id]: current.filter((c) => c.id !== complement.id) }
      }

      if (current.length >= group.max_quantity) {
        if (group.max_quantity === 1) {
          return { ...prev, [group.id]: [complement] }
        }
        toast.error(`Máximo de ${group.max_quantity} itens neste grupo`)
        return prev
      }

      return { ...prev, [group.id]: [...current, complement] }
    })
  }

  function calculateTotal() {
    if (!product) return 0
    const complementsTotal = Object.values(selectedComplements)
      .flat()
      .reduce((sum, c) => sum + c.price, 0)
    return (product.price + complementsTotal) * quantity
  }

  function handleAddToCart() {
    if (!product) return

    const groups = product.product_complement_groups || []
    for (const { complement_group } of groups) {
      if (complement_group.is_required) {
        const selected = selectedComplements[complement_group.id] || []
        if (selected.length < complement_group.min_quantity) {
          toast.error(`Selecione pelo menos ${complement_group.min_quantity} item(s) em "${complement_group.name}"`)
          return
        }
      }
    }

    addItem({
      product,
      quantity,
      complements: Object.values(selectedComplements).flat(),
      notes,
    })

    toast.success('Produto adicionado ao carrinho!')
    navigate('/cardapio/carrinho')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-6 w-24" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Produto não encontrado</p>
        <Button onClick={() => navigate('/cardapio')} className="mt-4">
          Voltar ao Cardápio
        </Button>
      </div>
    )
  }

  const complementGroups = product.product_complement_groups || []

  return (
    <div className="pb-32">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>

      {product.image_url && (
        <div className="w-full h-64 bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.description && (
          <p className="text-muted-foreground mt-2">{product.description}</p>
        )}
        <p className="text-xl font-semibold text-accent mt-4">
          {formatCurrency(product.price)}
        </p>

        {complementGroups.length > 0 && (
          <div className="mt-8 space-y-6">
            {complementGroups.map(({ complement_group }) => (
              <div key={complement_group.id} className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{complement_group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {complement_group.is_required ? 'Obrigatório' : 'Opcional'}
                      {complement_group.max_quantity > 1 && ` • Até ${complement_group.max_quantity} itens`}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {complement_group.complements.map((complement) => {
                    const isSelected = selectedComplements[complement_group.id]?.some(
                      (c) => c.id === complement.id
                    )
                    return (
                      <button
                        key={complement.id}
                        onClick={() => toggleComplement(complement_group, complement)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-lg border transition-colors',
                          isSelected
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-foreground/20'
                        )}
                      >
                        <span>{complement.name}</span>
                        <span className="text-sm font-medium">
                          {complement.price > 0 ? `+${formatCurrency(complement.price)}` : 'Grátis'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Label>Observações</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Sem cebola, bem passado..."
            className="mt-2"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity((q) => q + 1)}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          />
          <Button className="flex-1" onClick={handleAddToCart}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Adicionar {formatCurrency(calculateTotal())}
          </Button>
        </div>
      </div>
    </div>
  )
}
