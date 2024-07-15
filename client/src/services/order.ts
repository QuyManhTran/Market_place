import request from '@/configs/request';
import { CreateOrderResponse, GetOrdersResponse } from '@/types/request';

export const createOrder = async (userId: number) => {
    return request.post<CreateOrderResponse>(`/users/${userId}/orders`);
};

export const getOrders = async (userId: number) => {
    return request.get<GetOrdersResponse>(`/users/${userId}/orders`);
};
