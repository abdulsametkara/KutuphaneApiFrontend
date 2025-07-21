import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-search.component.html',
  styleUrls: ['./category-search.component.css']
})
export class CategorySearchComponent implements OnInit {

  searchName = '';
  searchId: number | null = null;
  categories: any[] = [];
  isLoading = false;
  isSearching = false;
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }
  ngOnInit(): void {
  }

  searchCategories(): void {
    if (!this.searchName.trim() && !this.searchId) {
      this.errorMessage = 'Lütfen kategori adı veya ID girin.';
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';

    if (this.searchId && this.searchId > 0) {
      this.categoryService.getCategoryById(this.searchId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess && response.data) {
            this.categories = [response.data];
          } else {
            this.errorMessage = response.message;
            this.categories = [];
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.error('ID ile kategori arama sırasında hata:', error);
          this.errorMessage = 'Backend ile bağlantı kurulamadı.';
          this.categories = [];
          this.isSearching = false;
        }
      });
    } else {
      this.categoryService.getCategoriesByName(this.searchName).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess && response.data) {
            this.categories = response.data;
          } else {
            this.errorMessage = response.message;
            this.categories = [];
          }
          this.isSearching = false;
        },
        error: (error) => {
          this.errorMessage = 'Backend ile bağlantı kurulamadı.';
          this.categories = [];
          this.isSearching = false;
        }
      });
    }
  }

  clearSearch(): void {
    this.searchName = '';
    this.searchId = null;
    this.categories = [];
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}
