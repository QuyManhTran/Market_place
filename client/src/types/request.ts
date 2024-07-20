import { IResponseCart } from './cart';
import { IResponseOrder, IResponseOrderDetail, IResponseOrders } from './order';
import { ISearchProduct, IUpdateAvatar } from './product';
import { IMyStore, ITopUp, IUserState } from './user';

export interface BaseResponse<T> {
    result: boolean;
    data?: T;
    message?: string;
}

export interface UserResponse extends BaseResponse<IUserState> {}
export interface SearchProductResponse extends BaseResponse<ISearchProduct> {}
export interface UpdateAvatarResponse extends BaseResponse<IUpdateAvatar> {}
export interface updateProfileResponse extends BaseResponse<any> {}
export interface CartResponse extends BaseResponse<IResponseCart> {}
export interface RemoveCartItem extends BaseResponse<any> {}
export interface CreateOrderResponse extends BaseResponse<IResponseOrder> {}
export interface GetOrdersResponse extends BaseResponse<IResponseOrders> {}
export interface GetOrderDetailResponse extends BaseResponse<IResponseOrderDetail> {}
export interface LogoutResponse extends BaseResponse<any> {}
export interface TopUpResponse extends BaseResponse<ITopUp> {}
export interface GetMyStoreResponse extends BaseResponse<{ store: IMyStore }> {}
