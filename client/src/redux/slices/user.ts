import { IUserState } from '@/types/user';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserState = {
    user: {
        id: 0,
        username: '',
        email: '',
        role: '',
        balance: 0,
        createdAt: '',
        updatedAt: '',
        profile: {
            id: 0,
            userId: 0,
            age: 0,
            address: '',
            phoneNumber: '',
            avatar: {
                id: 0,
                profileId: 0,
                url: '',
            },
            background: {
                id: 0,
                profileId: 0,
                url: '',
            },
        },
    },
    accessToken: {
        type: '',
        name: '',
        token: '',
        abilities: [],
        lastUsedAt: '',
        expiresAt: '',
    },
};

export const UserSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state = action.payload;
        },
    },
});

export const UserReducer = UserSlice.reducer;
export const UserAction = UserSlice.actions;
