import { IProduct } from './product';

export interface IResponseCart {
    cart: Icart;
}

export interface Icart {
    id: number;
    userId: number;
    total: number;
    items: ICartItem[];
    price: number;
}

export interface ICartItem {
    id: number;
    cartId: number;
    productId: number;
    product: IProduct;
}

export interface IAddCart {
    productId: number;
}
