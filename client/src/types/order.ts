import { IProduct } from './product';

export interface IResponseOrder {
    order: IOrder;
}

export interface IResponseOrders {
    orders: IOrder[];
}

export interface IOrder {
    id: number;
    userId: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    payment: IPayment;
}
export interface IOrderItem {
    id: number;
    orderId: number;
    productId: number;
    product: IProduct;
}

export interface IPayment {
    id: number;
    orderId: number;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}
