export interface IUserState {
    user: IUser;
    accessToken: IAcessToken;
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    role: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    profile: IProfile;
}

export interface IProfile {
    id: number;
    userId: number;
    age: number;
    address: string;
    phoneNumber: string;
    avatar: {
        id: number;
        profileId: number;
        url: string;
    };
    background: {
        id: number;
        profileId: number;
        url: string;
    };
}

export interface IAcessToken {
    type: string;
    name: string;
    token: string;
    abilities: string[];
    lastUsedAt: string;
    expiresAt: string;
}
