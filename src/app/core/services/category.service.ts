import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryCreateDto, CategoryUpdateDto } from '../models/category.model';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Tüm kategorileri getir
  getAllCategories(): Observable<ApiResponse<Category[]>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Category/ListAll`, { headers });
  }

  // ID ile kategori getir
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/Category/GetById/${id}`, { headers });
  }

  // Yeni kategori oluştur
  createCategory(category: CategoryCreateDto): Observable<ApiResponse<Category>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/Category/Create`, category, { headers });
  }

  // Kategori güncelle
  updateCategory(category: CategoryUpdateDto): Observable<ApiResponse<Category>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/Category/Update`, category, { headers });
  }

  // Kategori sil
  deleteCategory(id: number): Observable<ApiResponse<boolean>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/Category/Delete/${id}`, { headers });
  }

  // Kategori adı ile arama
  getCategoriesByName(name: string): Observable<ApiResponse<Category[]>> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Category/GetByName/${name}`, { headers });
  }
} 