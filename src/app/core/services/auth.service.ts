import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { UserLoginDto, UserCreateDto, LoginResponse } from '../models/user.model';

interface JwtPayload {
  name: string;
  sid: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(credentials: UserLoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/User/Login`, credentials);
  }

  register(user: UserCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/CreateUser`, user);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (error) {
        console.error('Token decode hatası:', error);
        return null;
      }
    }
    return null;
  }

  getCurrentUser(): any {
  const token = this.getToken();
  console.log('🎫 Raw token:', token);
  
  const decodedToken = this.getDecodedToken();
  console.log('🔍 Decoded token:', decodedToken);
  
  if (decodedToken) {
    const user = {
      id: decodedToken.sid,
      name: decodedToken.name,
      email: decodedToken.email,  
      role: decodedToken.role
    };

    return user;
  }
  return null;
}

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return false;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  }

  canCreate(): boolean {
  const user = this.getCurrentUser();
  return user?.role === 'Admin';
}

  canEdit(): boolean {
  const user = this.getCurrentUser();
  return user?.role === 'Admin';
}

  canDelete(): boolean {
  const user = this.getCurrentUser();
  return user?.role === 'Admin';
}

  isAdmin(): boolean {
  const user = this.getCurrentUser();
  return user?.role === 'Admin';
}

  isUser(): boolean {
  const user = this.getCurrentUser();
  return user?.role === 'User';
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}