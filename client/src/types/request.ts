import { ISearchProduct, IUpdateAvatar } from './product';
import { IUserState } from './user';

export interface BaseResponse<T> {
    result: boolean;
    data?: T;
    message?: string;
}

export interface UserResponse extends BaseResponse<IUserState> {}
export interface SearchProductResponse extends BaseResponse<ISearchProduct> {}
export interface UpdateAvatarResponse extends BaseResponse<IUpdateAvatar> {}
