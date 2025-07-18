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
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Category/ListAll`);
  }

  // ID ile kategori getir
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/Category/GetById/${id}`);
  }

  // Yeni kategori oluştur
  createCategory(category: CategoryCreateDto): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/Category/Create`, category);
  }

  // Kategori güncelle
  updateCategory(category: CategoryUpdateDto): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/Category/Update`, category);
  }

  // Kategori sil
  deleteCategory(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/Category/Delete/${id}`);
  }

  // Kategori adı ile arama
  getCategoriesByName(name: string): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Category/GetCategoriesByName?name=${name}`);
  }
} 