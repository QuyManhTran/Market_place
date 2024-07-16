import request from '@/configs/request';
import { CreateOrderResponse, GetOrderDetailResponse, GetOrdersResponse } from '@/types/request';

export const createOrder = async (userId: number) => {
    return request.post<CreateOrderResponse>(`/users/${userId}/orders`);
};

export const getOrders = async (userId: number) => {
    return request.get<GetOrdersResponse>(`/users/${userId}/orders`);
};

export const getOrderDetail = async (userId: number, orderId: number) => {
    return request.get<GetOrderDetailResponse>(`/users/${userId}/orders/${orderId}`);
};
