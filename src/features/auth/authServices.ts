import type { UserInfo } from "./authSlice";
import axios from "../../service/axios";


export interface VerifyResponse {
    access: string;
    refresh: string;
}

export interface LoginPayload {
    phone: string;
    password: string;
}
export interface LoginResponse {
    access: string;
    refresh: string;
}

export const loginUser = async (payload: LoginPayload) => {
    console.log(payload);
    const res = await axios.post<VerifyResponse>('/game-api/token/', payload);
    console.log(res.data);

    return res.data;
};

export const getMe = async (): Promise<UserInfo> => {

    const res = await axios.get<UserInfo>('/game-api/employees/me/');

    return res.data;
};
