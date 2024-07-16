import request from '@/configs/request';
import { IPagination } from '@/types/product';
import { SearchProductResponse } from '@/types/request';

export const searchProduct = async (
    page: IPagination = { cur_page: 1, per_page: 5 },
    keyword: string = '',
) => {
    return request.get<SearchProductResponse>('/stores/5/products', {
        params: { ...page, keyword },
    });
};

export const getStoreProducts = async (
    storeId: number,
    page: IPagination = { cur_page: 1, per_page: 5 },
) => {
    return request.get<SearchProductResponse>(`/stores/${storeId}/products/create`, {
        params: { ...page },
    });
};
