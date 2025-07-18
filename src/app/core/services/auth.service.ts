import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { UserLoginDto, UserCreateDto, LoginResponse } from '../models/user.model';

interface JwtPayload {
  name: string;
  sid: string; // user ID
  email: string;
  exp: number; // expiration timestamp
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

  // JWT Token'ı decode et
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

  // Kullanıcı bilgilerini al
  getCurrentUser(): any {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return {
        id: decodedToken.sid,
        name: decodedToken.name,
        email: decodedToken.email,
        role: 'Admin' // Şimdilik sabit, ileride token'dan gelecek
      };
    }
    return null;
  }

  // Token geçerli mi?
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return false;

    // Token expire kontrolü
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}