import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "~/database.types";

const STORAGE_KEY = "@coffee_shop_favorites";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
}

interface FavoritesActions {
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

type FavoritesStore = FavoritesState & FavoritesActions;

async function saveFavoritesToStorage(favorites: Product[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  isLoading: true,

  loadFavorites: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored) as Product[];
        set({ favorites });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: async (product) => {
    const { favorites } = get();
    if (favorites.some(f => f.id === product.id)) return;

    const newFavorites = [...favorites, product];
    set({ favorites: newFavorites });
    await saveFavoritesToStorage(newFavorites);
  },

  removeFavorite: async (productId) => {
    const { favorites } = get();
    const newFavorites = favorites.filter(f => f.id !== productId);
    set({ favorites: newFavorites });
    await saveFavoritesToStorage(newFavorites);
  },

  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some(f => f.id === productId);
  },

  toggleFavorite: async (productId) => {
    const { favorites } = get();
    const product = favorites.find(f => f.id === productId);
    if (product) {
      await get().removeFavorite(productId);
    } else {
      // We need the product data to add it to favorites
      const existingProduct = favorites.find(f => f.id === productId);
      if (existingProduct) {
        await get().addFavorite(existingProduct);
      }
    }
  },
})); 