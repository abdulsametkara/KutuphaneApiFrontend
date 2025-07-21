import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<ApiResponse<Author[]>>(`${this.apiUrl}/Author/ListAll`);
  }

  // ID ile yazar getir
  getAuthorById(id: number): Observable<ApiResponse<Author>> {
    return this.http.get<ApiResponse<Author>>(`${this.apiUrl}/Author/GetById?id=${id}`);
  }

  // Yeni yazar oluştur
  createAuthor(author: AuthorCreateDto): Observable<ApiResponse<Author>> {
    return this.http.post<ApiResponse<Author>>(`${this.apiUrl}/Author/Create`, author);
  }

  // Yazar güncelle
  updateAuthor(author: AuthorUpdateDto): Observable<ApiResponse<Author>> {
    return this.http.put<ApiResponse<Author>>(`${this.apiUrl}/Author/Update`, author);
  }

  // Yazar sil
  deleteAuthor(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/Author/Delete?id=${id}`);
  }

  getAuthorByName(name: string): Observable<ApiResponse<Author[]>> {
    return this.http.get<ApiResponse<Author[]>>(`${this.apiUrl}/Author/GetByName?name=${name}`);
  }
} 