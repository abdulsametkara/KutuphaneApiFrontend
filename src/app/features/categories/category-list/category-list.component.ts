// category-list.component.ts yapılandırması
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';


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
    if (confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) {     
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response && response.isSuccess) {

            this.categories = this.categories.filter(c => c.id !== category.id);
          } else {
            this.errorMessage = response.message;
            alert(response.message);
          }
        },
        error: (error: any) => {
          this.errorMessage = error.message;
          alert('Kategori silinirken bir hata oluştu');
        }
      });
    }
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
