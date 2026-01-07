import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, Complement, ComplementGroup } from '@/types/database'

export interface SelectedComplement {
  complement: Complement
  quantity: number
}

export interface SelectedComplementGroup {
  group: ComplementGroup
  selectedComplements: SelectedComplement[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  complementGroups: SelectedComplementGroup[]
  notes: string
  unitPrice: number
  totalPrice: number
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  notes: string
}

interface CartState {
  items: CartItem[]
  customerInfo: CustomerInfo | null
  deliveryFee: number
  
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setCustomerInfo: (info: CustomerInfo) => void
  setDeliveryFee: (fee: number) => void
  
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: null,
      deliveryFee: 0,

      addItem: (item) => {
        const id = crypto.randomUUID()
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }))
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item

            const complementsTotal = item.complementGroups.reduce((groupAcc, group) => {
              return groupAcc + group.selectedComplements.reduce((compAcc, comp) => {
                return compAcc + (comp.complement.price * comp.quantity)
              }, 0)
            }, 0)

            const unitPrice = item.product.price + complementsTotal
            const totalPrice = unitPrice * quantity

            return {
              ...item,
              quantity,
              unitPrice,
              totalPrice,
            }
          }),
        }))
      },

      clearCart: () => {
        set({ items: [], customerInfo: null })
      },

      setCustomerInfo: (info) => {
        set({ customerInfo: info })
      },

      setDeliveryFee: (fee) => {
        set({ deliveryFee: fee })
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.totalPrice, 0)
      },

      getTotal: () => {
        return get().getSubtotal() + get().deliveryFee
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
    }),
    {
      name: 'delivery-cart',
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
        deliveryFee: state.deliveryFee,
      }),
    }
  )
)
