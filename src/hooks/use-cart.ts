import { useCartStore, type CartItem, type SelectedComplementGroup } from '@/stores/cart-store'
import type { Product } from '@/types/database'

export function useCart() {
  const {
    items,
    customerInfo,
    deliveryFee,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setCustomerInfo,
    setDeliveryFee,
    getSubtotal,
    getTotal,
    getItemCount,
  } = useCartStore()

  const addToCart = (
    product: Product,
    quantity: number,
    complementGroups: SelectedComplementGroup[] = [],
    notes: string = ''
  ) => {
    const complementsTotal = complementGroups.reduce((groupAcc, group) => {
      return groupAcc + group.selectedComplements.reduce((compAcc, comp) => {
        return compAcc + (comp.complement.price * comp.quantity)
      }, 0)
    }, 0)

    const unitPrice = product.price + complementsTotal
    const totalPrice = unitPrice * quantity

    addItem({
      product,
      quantity,
      complementGroups,
      notes,
      unitPrice,
      totalPrice,
    })
  }

  const incrementQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      updateItemQuantity(itemId, item.quantity + 1)
    }
  }

  const decrementQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      updateItemQuantity(itemId, item.quantity - 1)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getItemDescription = (item: CartItem): string => {
    const parts: string[] = []

    item.complementGroups.forEach(group => {
      const complements = group.selectedComplements
        .map(sc => sc.quantity > 1 ? `${sc.quantity}x ${sc.complement.name}` : sc.complement.name)
        .join(', ')
      
      if (complements) {
        parts.push(`${group.group.name}: ${complements}`)
      }
    })

    return parts.join(' | ')
  }

  return {
    items,
    customerInfo,
    deliveryFee,
    addToCart,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    updateItemQuantity,
    clearCart,
    setCustomerInfo,
    setDeliveryFee,
    subtotal: getSubtotal(),
    total: getTotal(),
    itemCount: getItemCount(),
    formatPrice,
    getItemDescription,
    isEmpty: items.length === 0,
  }
}
