//book-list.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
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
  isLoading = true;
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
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
                this.loadBooks(); // Kitap listesini güncelle
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

  editBook(id: number): void {
    console.log('Kitap düzenleme sayfasına yönlendiriliyor, ID:', id);
    this.router.navigate(['/books/update', id]);
  }

  // Yeni kitap ekleme sayfasına git
  addNewBook(): void {
    this.router.navigate(['/books/add']);
  }

  // Dashboard'a dön
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}