import request from '@/configs/request';
import { IAddCart } from '@/types/cart';
import {
    CartResponse,
    RemoveCartItem,
    TopUpResponse,
    UpdateAvatarResponse,
    updateProfileResponse,
} from '@/types/request';
import { IUpdateProfile } from '@/types/user';

export const updateAvatar = async (formData: FormData) => {
    return request.patch<UpdateAvatarResponse>(`/users/edit/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            column: 'avatars',
        },
    });
};

export const updateProfile = async (data: IUpdateProfile) => {
    console.log(data);
    return request.patch<updateProfileResponse>('/users/edit/profile', data);
};

export const getCart = async (userId: number) => {
    return request.get<CartResponse>(`/users/${userId}/carts`);
};

export const addItemCart = async (data: IAddCart, userId: number) => {
    return request.post<CartResponse>(`/users/${userId}/carts`, data);
};

export const removeItemCart = async (userId: number, itemId: number) => {
    return request.delete<RemoveCartItem>(`/users/${userId}/carts/${itemId}`);
};

export const topUp = async (amount: number) => {
    return request.post<TopUpResponse>('/users/edit/topup', { amount });
};
