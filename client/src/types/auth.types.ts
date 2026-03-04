export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
}

export type LoginData = {
    email: string;
    password: string;
}