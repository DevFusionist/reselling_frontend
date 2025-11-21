import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  title: string;
  price: string;
  image: string;
};

type WishlistStore = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  exists: (id: string) => boolean;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) => {
        const items = get().items;
        const exists = items.find((i) => i.id === item.id);

        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },

      exists: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    { name: "wishlist-storage" } // localStorage key
  )
);
