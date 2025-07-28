// category-list.component.ts yapılandırması
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import Swal from 'sweetalert2';


interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryList {

  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private categoryService: CategoryService, private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        if (response && response.isSuccess) {
          this.categories = response.data;
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message;
      },
    });
  }

deleteCategory(category: Category): void {
  if (!category || !category.id) return;

  Swal.fire({
    title: 'Emin misiniz?',
    text: `"${category.name}" kategorisini silmek üzeresiniz.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Evet, sil!',
    cancelButtonText: 'Vazgeç'
  }).then((result) => {
    if (result.isConfirmed) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response && response.isSuccess) {
            this.categories = this.categories.filter(c => c.id !== category.id);

            Swal.fire({
              title: 'Silindi!',
              text: `"${category.name}" kategorisi başarıyla silindi.`,
              icon: 'success'
            });
          } else {
            this.errorMessage = response.message;
            Swal.fire({
              title: 'Hata!',
              text: response.message || 'Kategori silinemedi.',
              icon: 'error'
            });
          }
        },
        error: (error: any) => {
          this.errorMessage = error.message;
          Swal.fire({
            title: 'Sunucu Hatası!',
            text: 'Kategori silinirken bir hata oluştu.',
            icon: 'error'
          });
        }
      });
    }
  });
}

  viewCategoryDetails(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }
  searchCategories() : void {
    this.router.navigate(['/categories/search']); 
  }
  addNewCategory() : void {
    this.router.navigate(['/categories/add']);
  }
  updateCategory(category: Category): void {
    this.router.navigate(['/categories/update', category.id]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
