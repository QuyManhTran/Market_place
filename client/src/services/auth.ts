import request from '@/configs/request';
import { ILoginPayload, IRegisterPayload } from '@/types/auth';
import { BaseResponse, UserResponse } from '@/types/request';

export const login = async (data: ILoginPayload) => {
    return request.post<UserResponse>(`/auth/login`, data);
};

export const register = async (data: IRegisterPayload) => {
    return request.post<BaseResponse<any>>(`/auth/register`, data);
};

export const refresh = async () => {
    return request.post<UserResponse>(`/auth/refresh`);
};
