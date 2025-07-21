// book-search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  // Search criteria
  searchTitle = '';
  selectedAuthorId = 0;
  selectedCategoryId = 0;
  
  // Results
  books: any[] = [];
  authors: any[] = [];
  categories: any[] = [];
  
  // States
  isLoading = false;
  isSearching = false;
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  loadFilterOptions(): void {
    this.isLoading = true;
    
    // Load authors and categories for filters
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  searchBooks(): void {
    this.isSearching = true;
    this.errorMessage = '';
    this.books = [];

    // Search by author
    if (this.selectedAuthorId > 0) {
      this.bookService.getBooksByAuthor(this.selectedAuthorId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
            if (this.books.length === 0) {
              this.errorMessage = 'Bu yazara ait kitap bulunamadı';
            }
          } else {
            this.errorMessage = response?.message || 'Bu yazara ait kitap bulunamadı';
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Yazar arama hatası:', error);
          this.errorMessage = 'Bu yazara ait kitap bulunamadı.';
          this.isSearching = false;
        }
      });
    }
    // Search by category
    else if (this.selectedCategoryId > 0) {
      this.bookService.getBooksByCategory(this.selectedCategoryId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
            if (this.books.length === 0) {
              this.errorMessage = 'Bu kategoriye ait kitap bulunamadı';
            }
          } else {
            this.errorMessage = response?.message || 'Bu kategoriye ait kitap bulunamadı';
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Kategori arama hatası:', error);
          this.errorMessage = 'Bu kategoriye ait kitap bulunamadı.';
          this.isSearching = false;
        }
      });
    }
    // Frontend title search (tüm kitapları getir ve filtrele)
    else if (this.searchTitle.trim()) {
      this.bookService.getAllBooks().subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            const allBooks = response.data;
            // Frontend'de başlık ile filtrele
            this.books = allBooks.filter((book: any) => 
              book.title.toLowerCase().includes(this.searchTitle.toLowerCase())
            );
            if (this.books.length === 0) {
              this.errorMessage = 'Arama kriterlerine uygun kitap bulunamadı';
            }
          } else {
            this.errorMessage = 'Kitaplar yüklenirken hata oluştu';
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Arama hatası:', error);
          this.errorMessage = 'Arama sırasında hata oluştu';
          this.isSearching = false;
        }
      });
    }
    else {
      this.errorMessage = 'Lütfen arama kriterlerinden birini seçin';
      this.isSearching = false;
    }
  }

  clearSearch(): void {
    this.searchTitle = '';
    this.selectedAuthorId = 0;
    this.selectedCategoryId = 0;
    this.books = [];
    this.errorMessage = '';
  } 
  editBook(id: number): void {
    this.router.navigate(['/books/update', id]);
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
}