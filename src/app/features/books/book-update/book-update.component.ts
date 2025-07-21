// book-update.component.ts - TypeScript Errors Fixed
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { BookUpdateDto } from '../../../core/models/book.model';
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
  selector: 'app-book-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {
  book: BookUpdateDto = {
    id: 0,
    title: '',
    description: '',
    countofPage: 0,
    authorId: 0,
    categoryId: 0
  };

  // ✅ Gerçek API'den gelecek
  authors: Author[] = [];
  categories: Category[] = [];

  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  authorsLoading = true;
  categoriesLoading = true;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('BookUpdateComponent yüklendi!');
    
    // URL'den ID parametresini al
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComponentData(Number(id));
    } else {
      this.errorMessage = 'Kitap ID\'si bulunamadı';
      this.router.navigate(['/books']);
    }
  }

  // ✅ Tüm verileri paralel olarak yükle - TypeScript tip düzeltmesi
  loadComponentData(bookId: number): void {
    console.log('Component verileri yükleniyor...');
    this.isLoading = true;

    // ✅ Tip tanımlamaları ile forkJoin
    forkJoin({
      book: this.bookService.getBookById(bookId),
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses: {
        book: any;
        authors: any;
        categories: any;
      }) => {
        console.log('API responses:', responses);

        // ✅ Kitap verilerini yükle - tip kontrolü
        if (responses.book && responses.book.isSuccess) {
          this.book = responses.book.data;
          console.log('Kitap verileri yüklendi:', this.book);
        } else {
          this.errorMessage = responses.book?.message || 'Kitap verileri yüklenemedi';
          console.error('Kitap yükleme hatası:', responses.book);
        }

        // ✅ Yazarları yükle - tip kontrolü
        if (responses.authors && responses.authors.isSuccess) {
          this.authors = responses.authors.data;
          console.log('Yazarlar yüklendi:', this.authors);
        } else {
          console.error('Yazarlar yüklenemedi:', responses.authors?.message);
        }

        // ✅ Kategorileri yükle - tip kontrolü
        if (responses.categories && responses.categories.isSuccess) {
          this.categories = responses.categories.data;
          console.log('Kategoriler yüklendi:', this.categories);
        } else {
          console.error('Kategoriler yüklenemedi:', responses.categories?.message);
        }

        // ✅ Loading durumlarını kapat
        this.isLoading = false;
        this.authorsLoading = false;
        this.categoriesLoading = false;
      },
      error: (error: any) => {
        console.error('Component verileri yüklenirken hata:', error);
        this.errorMessage = 'Veriler yüklenirken hata oluştu';
        this.isLoading = false;
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

    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Kitap güncelleniyor:', this.book);

    this.bookService.updateBook(this.book).subscribe({
      next: (response: any) => {
        if (response && response.isSuccess) {
          this.successMessage = 'Kitap başarıyla güncellendi!';
          console.log('Güncelleme başarılı:', response);
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);
        } else {
          this.errorMessage = response?.message || 'Kitap güncellenemedi';
          console.error('Güncelleme hatası:', response);
        }
        this.isSubmitted = false;
      },
      error: (error: any) => {
        console.error('Kitap güncellenirken hata:', error);
        this.errorMessage = 'Kitap güncellenirken bir hata oluştu';
        this.isSubmitted = false;
      }
    });
  }

  isFormValid(): boolean {
    return this.book.title?.trim() !== '' &&
           (this.book.countofPage ?? -1) > 0 &&
           (this.book.authorId ?? -1) > 0 &&
           (this.book.categoryId ?? -1) > 0 &&
           this.book.description?.trim() !== '';
  }

  clearForm(): void {
    this.book = {
      id: this.book.id, // ID'yi koru
      title: '',
      description: '',
      countofPage: 0,
      authorId: 0,
      categoryId: 0
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitted = false;
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  get isDataLoaded(): boolean {
    return !this.isLoading && !this.authorsLoading && !this.categoriesLoading;
  }
}