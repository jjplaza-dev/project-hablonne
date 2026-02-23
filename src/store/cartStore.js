import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, size, quantity) => {
        set((state) => {
          const cartItemId = `${product.id}-${size}`;
          const existingItemIndex = state.cart.findIndex((item) => item.cartItemId === cartItemId);

          if (existingItemIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += quantity;
            return { cart: updatedCart };
          }

          return {
            cart: [
              ...state.cart,
              { 
                ...product, 
                cartItemId, 
                selectedSize: size, 
                quantity 
              },
            ],
          };
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, action) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.cartItemId === cartItemId) {
              if (action === 'increase' && item.quantity < 10) {
                return { ...item, quantity: item.quantity + 1 };
              }
              if (action === 'decrease' && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
              }
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'hablonne-cart-storage',
    }
  )
);