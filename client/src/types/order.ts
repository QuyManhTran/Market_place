import { IBaseItem } from './cart';
import { IProduct } from './product';

export interface IResponseOrder {
    order: IOrder;
}

export interface IResponseOrderDetail {
    order: IOrderDetail;
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

export interface IOrderDetail extends IOrder {
    items: IOrderItem[];
}
export interface IOrderItem extends IBaseItem {
    orderId: number;
}

export interface IPayment {
    id: number;
    orderId: number;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}
