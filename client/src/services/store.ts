import request from '@/configs/request';
import { IProduct } from '@/types/product';
import { BaseResponse } from '@/types/request';

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
