import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryCreateDto } from '../../../core/models/category.model';
import { forkJoin } from 'rxjs';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}


@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})

export class CategoryForm implements OnInit {

  category: CategoryCreateDto = {
    name: '',
    description: ''
  };

  isloading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
  }

  onsubmit(): void {
    if(!this.category.name || !this.category.description) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService.createCategory(this.category).subscribe({
      next: (response: ApiResponse<CategoryCreateDto>) => {
        if (response &&response.isSuccess) {
          this.successMessage = response.message ;
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);

          this.router.navigate(['/categories']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Bir hata oluştu';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  clearForm(): void {
    this.category = {
      name: '',
      description: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}


