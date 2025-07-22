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

  book: BookCreateDto = {
    title: '',
    description: '',
    countofPage: 0,
    authorId: 0,
    categoryId: 0
  };

  authors: Author[] = [];
  categories: Category[] = [];

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
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

  loadFormData(): void {
    console.log('Form verileri yükleniyor...');
    
    forkJoin({
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses) => {
        console.log('API responses:', responses);

        if (responses.authors.isSuccess) {
          this.authors = responses.authors.data;
        } else {
          this.errorMessage = 'Yazarlar yüklenemedi';
        }

        if (responses.categories.isSuccess) {
          this.categories = responses.categories.data;
        } else {
          this.errorMessage = 'Kategoriler yüklenemedi';
        }

        this.authorsLoading = false;
        this.categoriesLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Form verileri yüklenirken hata oluştu';
        this.authorsLoading = false;
        this.categoriesLoading = false;
      }
    });
  }


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
          
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 500);
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

  isFormValid(): boolean {
    return this.book.title?.trim() !== '' &&
           (this.book.countofPage ?? 0) > 0 &&
           (this.book.authorId ?? 0) > 0 &&
           (this.book.categoryId ?? 0) > 0 &&
           this.book.description?.trim() !== '';
  }

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

  goBack(): void {
    this.router.navigate(['/books']);
  }

  get isDataLoaded(): boolean {
    return !this.authorsLoading && !this.categoriesLoading;
  }

  trackByAuthor(index: number, author: Author): number {
    return author.id;
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  getAuthorDisplayName(author: Author): string {
    return `${author.name} ${author.surname} (${author.yearofBirth})`;
  }

  getCategoryDisplayName(category: Category): string {
    return category.description 
      ? `${category.name} - ${category.description}`
      : category.name;
  }
}