import { create } from "zustand";
import { Database } from "~/database.types";
import { useLocationStore } from "~/src/store/use-location-store";

type Product = Database["public"]["Tables"]["products"]["Row"];

export type CartItem = {
  product: Product;
  quantity: number;
  size: "S" | "M" | "L";
};

interface CartState {
  items: CartItem[];
  deliveryType: "Deliver" | "Pick Up";
  discount: {
    applied: boolean;
    amount: number;
  };
  deliveryFee: {
    original: number;
    discounted: number;
  };
  paymentMethod: {
    type: "Cash/Wallet" | "Card";
    selected: boolean;
  };
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: CartItem["size"]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSize: (productId: string, size: CartItem["size"]) => void;
  setDeliveryType: (type: "Deliver" | "Pick Up") => void;
  setDiscount: (discount: { applied: boolean; amount: number }) => void;
  setPaymentMethod: (method: { type: "Cash/Wallet" | "Card"; selected: boolean }) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  deliveryType: "Deliver",
  discount: {
    applied: false,
    amount: 0,
  },
  deliveryFee: {
    original: 2.0,
    discounted: 1.0,
  },
  paymentMethod: {
    type: "Cash/Wallet",
    selected: true,
  },

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.product.id === item.product.id && i.size === item.size
      );
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product.id === item.product.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (productId: string, size: CartItem["size"]) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.size === size)
      ),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }),

  updateSize: (productId, size) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, size } : item
      ),
    })),

  setDeliveryType: (type) => set({ deliveryType: type }),
  
  setDiscount: (discount) => set({ discount }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const state = get();
    const itemsTotal = state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const deliveryFee = state.deliveryType === "Deliver" ? state.deliveryFee.discounted : 0;
    const discount = state.discount.applied ? state.discount.amount : 0;
    return itemsTotal + deliveryFee - discount;
  },

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
})); 