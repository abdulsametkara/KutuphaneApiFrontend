//book-list.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = [];
  authors: any[] = [];
  categories: any[] = [];

  isLoading = true;
  errorMessage = '';


  searchTitle = '';
  selectedAuthorId = 0;
  selectedCategoryId = 0;
  showFilters = false;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadFilterData();
  }

loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllBooks().subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        
        if (response && response.isSuccess) {
          this.books = response.data || [];
        } else {
          this.errorMessage = response.message || 'Kitaplar yüklenemedi';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kitaplar yüklenirken hata:', error);
        this.errorMessage = 'Kitaplar yüklenirken bir hata oluştu';
        this.isLoading = false;
      }
    });
  }

  deleteBook(id: number): void {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
            if (response && response.isSuccess) {
                this.loadBooks();
            } else {
            alert('Kitap silinemedi: ' + response.message);
            }
                    },
        error: (error) => {
          console.error('Kitap silinirken hata: ', error);
          alert('Kitap silinirken bir hata oluştu');
        }
      });
    }
  }

  loadFilterData(): void {
    this.authorService.getAllAuthors().subscribe({
      next: (response: any) => {
        if (response && response.isSuccess) {
          this.authors = response.data;
        }
      },
      error: (error) => console.error('Yazarlar yüklenirken hata:', error)
    });

    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response && response.isSuccess) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Kategoriler yüklenirken hata:', error)
    });
  }

  filterByAuthor(): void {
    if (this.selectedAuthorId > 0) {
      this.bookService.getBooksByAuthor(this.selectedAuthorId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
          } else {
            this.books = [];
            this.errorMessage = 'Bu yazara ait kitap bulunamadı';
          }
        },
        error: (error) => {
          console.error('Yazar filtreleme hatası:', error);
          this.errorMessage = 'Filtreleme sırasında hata oluştu';
        }
      });
    } else {
      this.books = [...this.allBooks];
    }
    this.clearOtherFilters('author');
  }

  filterByCategory(): void {
    if (this.selectedCategoryId > 0) {
      this.bookService.getBooksByCategory(this.selectedCategoryId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
          } else {
            this.books = [];
            this.errorMessage = 'Bu kategoriye ait kitap bulunamadı';
          }
        },
        error: (error) => {
          console.error('Kategori filtreleme hatası:', error);
          this.errorMessage = 'Filtreleme sırasında hata oluştu';
        }
      });
    } else {
      this.books = [...this.allBooks];
    }
    this.clearOtherFilters('category');
  }

  clearOtherFilters(activeFilter: string): void {
    if (activeFilter !== 'title') this.searchTitle = '';
    if (activeFilter !== 'author') this.selectedAuthorId = 0;
    if (activeFilter !== 'category') this.selectedCategoryId = 0;
    this.errorMessage = '';
  }

  clearAllFilters(): void {
    this.searchTitle = '';
    this.selectedAuthorId = 0;
    this.selectedCategoryId = 0;
    this.books = [...this.allBooks];
    this.errorMessage = '';
  }

  openAdvancedSearch(): void {
    this.router.navigate(['/books/search']);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  searchBooks(): void {
    this.router.navigate(['/books/search']);
  }

  editBook(id: number): void {
    console.log('Kitap düzenleme sayfasına yönlendiriliyor, ID:', id);
    this.router.navigate(['/books/update', id]);
  }

  addNewBook(): void {
    this.router.navigate(['/books/add']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}