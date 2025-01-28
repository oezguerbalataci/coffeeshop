import { create } from 'zustand';
import { Database } from '~/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface CoffeeStore {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Categories
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  
  // Cart
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
}

export const useCoffeeStore = create<CoffeeStore>((set) => ({
  // Products
  products: [],
  setProducts: (products) => set({ products }),
  
  // Categories
  selectedCategory: 'All Coffee',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  // Cart
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
  
  // Favorites
  favorites: [],
  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),
})); 