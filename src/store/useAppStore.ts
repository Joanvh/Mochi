import { create } from "zustand";
import type {
  DemoUser,
  Incident,
  Route,
  ShoppingListItem,
  ShoppingSession,
  Store,
} from "../types";

interface AppState {
  activeIncidents: Incident[];
  activeRoute: Route | null;
  currentStore: Store | null;
  currentUser: DemoUser | null;
  draftShoppingList: ShoppingListItem[];
  shoppingSession: ShoppingSession | null;
  addDraftShoppingListItem: (item: ShoppingListItem) => void;
  clearDraftShoppingList: () => void;
  removeDraftShoppingListItem: (itemId: string) => void;
  setActiveIncidents: (incidents: Incident[]) => void;
  setActiveRoute: (route: Route | null) => void;
  setCurrentStore: (store: Store | null) => void;
  setCurrentUser: (user: DemoUser | null) => void;
  setDraftShoppingList: (items: ShoppingListItem[]) => void;
  setShoppingSession: (session: ShoppingSession | null) => void;
  updateDraftShoppingListItem: (
    itemId: string,
    update: Partial<ShoppingListItem>,
  ) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeIncidents: [],
  activeRoute: null,
  currentStore: null,
  currentUser: null,
  draftShoppingList: [],
  shoppingSession: null,
  addDraftShoppingListItem: (item) =>
    set((state) => ({
      draftShoppingList: [...state.draftShoppingList, item],
    })),
  clearDraftShoppingList: () => set({ draftShoppingList: [] }),
  removeDraftShoppingListItem: (itemId) =>
    set((state) => ({
      draftShoppingList: state.draftShoppingList.filter(
        (item) => item.id !== itemId,
      ),
    })),
  setActiveIncidents: (activeIncidents) => set({ activeIncidents }),
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setCurrentStore: (currentStore) => set({ currentStore }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setDraftShoppingList: (draftShoppingList) => set({ draftShoppingList }),
  setShoppingSession: (shoppingSession) => set({ shoppingSession }),
  updateDraftShoppingListItem: (itemId, update) =>
    set((state) => ({
      draftShoppingList: state.draftShoppingList.map((item) =>
        item.id === itemId ? { ...item, ...update } : item,
      ),
    })),
}));
