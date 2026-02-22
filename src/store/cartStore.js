import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add item to cart or update quantity if it already exists
      addToCart: (product, size, quantity) => {
        set((state) => {
          // Create a composite key to distinguish between different sizes of the same item
          const cartItemId = `${product.id}-${size}`;
          const existingItemIndex = state.cart.findIndex((item) => item.cartItemId === cartItemId);

          if (existingItemIndex !== -1) {
            // Item exists, create a new array with the updated quantity
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += quantity;
            return { cart: updatedCart };
          }

          // Item does not exist, push as a new entry
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

      // Remove item entirely using the composite key
      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      // Increment or decrement quantity directly from the cart
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

      // Empty the cart completely
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'hablonne-cart-storage', // The key used in localStorage
      // getStorage: () => localStorage, // (Optional) localStorage is the default
    }
  )
);