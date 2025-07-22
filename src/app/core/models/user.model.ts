export interface User {
  name: string;
  surname: string;
  username: string;
  email?: string;
}

export interface UserLoginDto {
  username?: string;
  email?: string;
  password: string;
}

export interface UserCreateDto {
  name: string;
  surname: string;
  username: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: string;
}
