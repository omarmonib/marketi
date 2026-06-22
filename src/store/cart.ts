import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.stock),
                  }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'marketi-cart',
    }
  )
)
