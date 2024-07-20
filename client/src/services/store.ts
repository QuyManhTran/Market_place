import request from '@/configs/request';
import { IProduct } from '@/types/product';
import { BaseResponse } from '@/types/request';
import { ICreateStore } from '@/types/user';

export const CreateStore = async (data: ICreateStore) => {
    return request.post<BaseResponse<any>>('/stores', data);
};

export const createProduct = async (data: FormData, storeId: number) => {
    return request.post<BaseResponse<{ product: IProduct }>>(`/stores/${storeId}/products`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateProduct = async (
    data: FormData,
    storeId: number,
    productId: number,
    isChangeImage: boolean = false,
) => {
    return request.patch<BaseResponse<{ product: IProduct }>>(
        `/stores/${storeId}/products/${productId}`,
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: {
                isChangeImage,
            },
        },
    );
};

export const removeStoreProduct = async (storeId: number, productId: number) => {
    return request.delete<BaseResponse<any>>(`/stores/${storeId}/products/${productId}`);
};
