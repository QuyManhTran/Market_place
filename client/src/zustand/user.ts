import { IUserState } from '@/types/user';
import { create } from 'zustand';

export interface IUserStore {
    user: IUserState;
    setUser: (data: IUserState) => void;
    setAvatar: (data: string) => void;
    setProfile: (data: string) => void;
}
const initialState: IUserState = {
    user: {
        id: 0,
        username: '',
        email: '',
        profile: {
            avatar: {
                id: 0,
                url: '',
                profileId: 0,
            },
            address: '',
            age: 0,
            background: {
                id: 0,
                profileId: 0,
                url: '',
            },
            id: 0,
            phoneNumber: '',
            userId: 0,
        },
        balance: 0,
        createdAt: '',
        role: '',
        updatedAt: '',
    },
    accessToken: {
        abilities: [],
        expiresAt: '',
        lastUsedAt: '',
        name: '',
        token: '',
        type: '',
    },
};

export const userStore = create<IUserStore>((set) => ({
    user: initialState,
    setUser: (data: IUserState) => set(() => ({ user: data })),
    setAvatar: (data: string) =>
        set((state) => ({
            ...state,
            user: {
                ...state.user,
                profile: {
                    ...state.user.user.profile,
                    avatar: { ...state.user.user.profile.avatar, url: data },
                },
            },
        })),
    setProfile: (data: string) =>
        set((state) => ({
            ...state,
            user: {
                ...state.user,
                user: { ...state.user.user, username: data },
            },
        })),
}));
