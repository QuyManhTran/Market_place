import request from '@/configs/request';
import { IPagination } from '@/types/product';
import { SearchProductResponse } from '@/types/request';

export const searchProduct = async (
    page: IPagination = { cur_page: 1, per_page: 5 },
    keyword: string = '',
) => {
    return request.get<SearchProductResponse>('/stores/4/products', {
        params: { ...page, keyword },
    });
};
