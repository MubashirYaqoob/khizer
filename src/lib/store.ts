import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Composite unique key: productId + size
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.size}`;
        const items = get().items;
        const existingItem = items.find((item) => item.id === id);

        if (existingItem) {
          const updatedQuantity = existingItem.quantity + newItem.quantity;
          // Limit to stock if available
          const finalQuantity = newItem.stock ? Math.min(updatedQuantity, newItem.stock) : updatedQuantity;
          set({
            items: items.map((item) =>
              item.id === id ? { ...item, quantity: finalQuantity } : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, id }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          const finalQuantity = item.stock ? Math.min(quantity, item.stock) : quantity;
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity: finalQuantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'kfs-cart-storage',
    }
  )
);
