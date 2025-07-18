import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { BookCreateDto } from '../../../core/models/book.model';

// Geçici interfaces - service'ler gelene kadar
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
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-book-form',
  standalone: true,
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

  // Dropdown Listeleri - ngFor için
  authors: Author[] = [
    { id: 1, name: 'Orhan', surname: 'Pamuk', yearofBirth: 1952 },
    { id: 2, name: 'Sabahattin', surname: 'Ali', yearofBirth: 1907 },
    { id: 3, name: 'Nazım', surname: 'Hikmet', yearofBirth: 1902 }
  ];
  
  categories: Category[] = [
    { id: 1, name: 'Roman' },
    { id: 2, name: 'Şiir' },
    { id: 3, name: 'Hikaye' },
    { id: 4, name: 'Klasik' }
  ];

  // State Management - ngIf için
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  // Loading States - ngIf için
  authorsLoading = false;
  categoriesLoading = false;

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('📝 Book Form component yüklendi!');
    console.log('👥 Authors:', this.authors);
    console.log('📚 Categories:', this.categories);
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

    console.log('📖 Kitap kaydediliyor:', this.book);

    this.bookService.createBook(this.book).subscribe({
      next: (response: any) => {
        if (response && response.isSuccess) {
          this.successMessage = 'Kitap başarıyla eklendi!';
          console.log('✅ Kitap kaydedildi:', response);
          
          // 2 saniye sonra liste sayfasına dön
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Kitap eklenemedi.';
        }
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('❌ Kitap kaydetme hatası:', error);
        this.errorMessage = 'Kitap kaydedilirken hata oluştu.';
        this.isSubmitting = false;
      }
    });
  }

  // Form validation
  isFormValid(): boolean {
    return this.book.title.trim() !== '' &&
           this.book.countofPage > 0 &&
           this.book.authorId >= 0 &&
           this.book.categoryId >= 0;
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

  // TrackBy function for performance - ngFor için
  trackByCategory(index: number, category: Category): number {
    return category.id;
  }
} 