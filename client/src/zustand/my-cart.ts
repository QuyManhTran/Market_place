import { Icart } from '@/types/cart';
import { create } from 'zustand';

export interface ICartStore {
    cart: Icart;
    setCart: (data: Icart) => void;
    removeItem: (itemId: number, price: number) => void;
    removeCart: () => void;
}

const initialState: Icart = {
    id: 0,
    userId: 0,
    items: [],
    total: 0,
    price: 0,
};

export const cartStore = create<ICartStore>((set) => ({
    cart: initialState,
    setCart: (data: Icart) => set((state) => ({ ...state, cart: data })),
    removeItem: (itemId: number, price: number) =>
        set((state) => ({
            ...state,
            cart: {
                ...state.cart,
                total: state.cart.total - 1,
                price: state.cart.price - price,

                items: state.cart.items.filter((item) => item.id !== itemId),
            },
        })),
    removeCart: () => set((state) => ({ ...state, cart: initialState })),
}));
