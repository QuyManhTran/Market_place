import request from '@/configs/request';
import { UpdateAvatarResponse } from '@/types/request';

export const updateAvatar = async (formData: FormData) => {
    return request.patch<UpdateAvatarResponse>(`/users/edit/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            column: 'avatars',
        },
    });
};
