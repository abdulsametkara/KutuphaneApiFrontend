import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryUpdateDto } from '../../../core/models/category.model';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}


@Component({
  selector: 'app-category-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {
  category: CategoryUpdateDto = {
    id: 0,
    name: '',
    description: ''
  };

  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComponentData(Number(id));
    } else {
      this.errorMessage = 'Geçersiz kategori ID\'si.';
      this.router.navigate(['/categories']);
    }
  }

  loadComponentData(id: number): void {
    this.isLoading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (response: ApiResponse<CategoryUpdateDto>) => {
        if (response.isSuccess) {
          this.category = response.data;
          this.isLoading = false;
        } else {
          this.errorMessage = response.message;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Bir hata oluştu: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if(!this.category.name || !this.category.description) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }

    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.categoryService.updateCategory(this.category).subscribe({
      next: (response: ApiResponse<CategoryUpdateDto>) => {
        if (response.isSuccess) {
          this.successMessage = response.message;
          this.clearMessages();
                  setTimeout(() => {
                      this.router.navigate(['/authors']);
                  }, 2000);
        } else {
          this.errorMessage = response.message;
          this.clearMessages();
        }
        this.isSubmitted = false;
      },
      error: (error) => {
        this.errorMessage = 'Bir hata oluştu: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.category = {
      id: 0,
      name: '',
      description: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  get isDataLoaded(): boolean {
    return this.category && this.category.id > 0;
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    },5000);
  }
}