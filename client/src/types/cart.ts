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

export interface IBaseItem {
    id: number;
    product: IProduct;
    productId: number;
}

export interface ICartItem extends IBaseItem {
    cartId: number;
}

export interface IAddCart {
    productId: number;
}
