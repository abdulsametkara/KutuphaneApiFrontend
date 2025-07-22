import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Author, AuthorCreateDto, AuthorUpdateDto } from '../models/author.model';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Tüm yazarları getir
  getAllAuthors(): Observable<ApiResponse<Author[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Author[]>>(`${this.apiUrl}/Author/ListAll`, { headers });
  }

  // ID ile yazar getir
  getAuthorById(id: number): Observable<ApiResponse<Author>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Author>>(`${this.apiUrl}/Author/GetById?id=${id}`, { headers });
  }

  // Yeni yazar oluştur
  createAuthor(author: AuthorCreateDto): Observable<ApiResponse<Author>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<Author>>(`${this.apiUrl}/Author/Create`, author, { headers });
  }

  // Yazar güncelle
  updateAuthor(author: AuthorUpdateDto): Observable<ApiResponse<Author>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ApiResponse<Author>>(`${this.apiUrl}/Author/Update`, author, { headers });
  }

  // Yazar sil
  deleteAuthor(id: number): Observable<ApiResponse<boolean>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/Author/Delete?id=${id}`, { headers });
  }

  // Yazar adına göre yazar getir
  getAuthorByName(name: string): Observable<ApiResponse<Author[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Author[]>>(`${this.apiUrl}/Author/GetByName?name=${name}`, { headers });
  }
} 