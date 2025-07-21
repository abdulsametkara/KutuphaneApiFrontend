// book-form.component.ts - Real API Integration
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { BookCreateDto } from '../../../core/models/book.model';
import { forkJoin } from 'rxjs';

interface Author {
  id: number;
  name: string;
  surname: string;
  placeofBirth?: string;
  yearofBirth: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  // Form Data - ngModel için
  book: BookCreateDto = {
    title: '',
    description: '',
    countofPage: 0,
    authorId: 0,
    categoryId: 0
  };

  // ✅ Gerçek API'den gelecek
  authors: Author[] = [];
  categories: Category[] = [];

  // State Management - ngIf için
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  // Loading States - ngIf için
  authorsLoading = true;
  categoriesLoading = true;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('📝 Book Form component yüklendi!');
    this.loadFormData();
  }

  // ✅ Form verilerini gerçek API'den yükle
  loadFormData(): void {
    console.log('Form verileri yükleniyor...');
    
    // ✅ Yazarları ve kategorileri paralel olarak yükle
    forkJoin({
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses) => {
        console.log('API responses:', responses);

        // ✅ Yazarları yükle
        if (responses.authors.isSuccess) {
          this.authors = responses.authors.data;
          console.log('👥 Yazarlar yüklendi:', this.authors);
        } else {
          console.error('Yazarlar yüklenemedi:', responses.authors.message);
          this.errorMessage = 'Yazarlar yüklenemedi';
        }

        // ✅ Kategorileri yükle
        if (responses.categories.isSuccess) {
          this.categories = responses.categories.data;
          console.log('📚 Kategoriler yüklendi:', this.categories);
        } else {
          console.error('Kategoriler yüklenemedi:', responses.categories.message);
          this.errorMessage = 'Kategoriler yüklenemedi';
        }

        // ✅ Loading durumlarını kapat
        this.authorsLoading = false;
        this.categoriesLoading = false;
      },
      error: (error) => {
        console.error('Form verileri yüklenirken hata:', error);
        this.errorMessage = 'Form verileri yüklenirken hata oluştu';
        this.authorsLoading = false;
        this.categoriesLoading = false;
      }
    });
  }

  // Form submit
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';


    this.bookService.createBook(this.book).subscribe({
      next: (response: ApiResponse<BookCreateDto>) => {
        if (response && response.isSuccess) {
          this.successMessage = response.message;
          
          // 2 saniye sonra liste sayfasına dön
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = 'Kitap kaydedilirken hata oluştu.';
        this.isSubmitting = false;
      }
    });
  }

  // Form validation
  isFormValid(): boolean {
    return this.book.title?.trim() !== '' &&
           (this.book.countofPage ?? 0) > 0 &&
           (this.book.authorId ?? 0) > 0 &&
           (this.book.categoryId ?? 0) > 0 &&
           this.book.description?.trim() !== '';
  }

  // Form temizle
  clearForm(): void {
    this.book = {
      title: '',
      description: '',
      countofPage: 0,
      authorId: 0,
      categoryId: 0
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Geri git
  goBack(): void {
    this.router.navigate(['/books']);
  }

  // Data loaded check - ngIf için
  get isDataLoaded(): boolean {
    return !this.authorsLoading && !this.categoriesLoading;
  }

  // TrackBy functions for performance - ngFor için
  trackByAuthor(index: number, author: Author): number {
    return author.id;
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  // ✅ Yazar adını formatla
  getAuthorDisplayName(author: Author): string {
    return `${author.name} ${author.surname} (${author.yearofBirth})`;
  }

  // ✅ Kategori adını formatla
  getCategoryDisplayName(category: Category): string {
    return category.description 
      ? `${category.name} - ${category.description}`
      : category.name;
  }
}