// book-list.component.ts - Updated with Popup Functionality
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { UploadService } from '../../../core/services/upload.service';
import { BookLoanService } from '../../../core/services/book-loan.service';
import { Book } from '../../../core/models/book.model';
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

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = [];
  authors: Author[] = [];
  categories: Category[] = [];

  isLoading = true;
  errorMessage = '';

  // 🆕 POPUP STATE VARIABLES
  showModal = false;
  selectedBook: Book | null = null;
  selectedAuthor: Author | null = null;
  selectedCategory: Category | null = null;
  isBorrowing = false;
  userActiveLoans: any[] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private uploadService: UploadService,
    private bookLoanService: BookLoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadFilterData();
    this.loadBookImages();
    this.loadUserActiveLoans();
  }

  loadUserActiveLoans(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.bookLoanService.getUserActiveLoans(currentUser.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.userActiveLoans = response.data;
            console.log('Kullanıcı aktif ödünç kitapları:', this.userActiveLoans);
          } else {
            console.log('Aktif ödünç kitap bulunamadı.');
          }
        },
        error: (error) => {
          console.error('Aktif ödünç kitaplar yüklenirken hata:', error);
        }
      });
    }
  }

  borrowBook(book: Book): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert('Lütfen önce giriş yapın.');
      return;
    }

    if (book.availableCopies <= 0) {
      alert('Bu kitap şu anda mevcut değil.');
      return;
    }

    if (this.isBookBorrowed(book.id)) {
      alert('Bu kitabı zaten ödünç almışsınız.');
      return;
    }

    this.isBorrowing = true;
    
    const borrowData = {
      bookId: book.id,
      userId: currentUser.id,
    };

    console.log('Ödünç alma isteği:', borrowData);

    this.bookLoanService.createBookLoan(borrowData).subscribe({
      next: (response) => {
        console.log('Ödünç alma yanıtı:', response);
        
        if (!response.success) {
          alert('Kitap başarıyla ödünç alındı! 📚');
          
          this.loadBooks();
          this.loadUserActiveLoans();
          this.closeBookModal();
          
        } else {
          alert('Hata: ');
        }
        this.isBorrowing = false;
        
      },
      error: (error) => {
        console.error('Kitap ödünç alınırken hata:', error);
        alert('Kitap ödünç alınırken bir hata oluştu.');
        this.isBorrowing = false;
      }
    });
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllBooks().subscribe({
      next: (response) => {
        console.log('Kitaplar API yanıtı:', response);
        
        if (response && response.isSuccess) {
          this.books = response.data || [];
          console.log('Yüklenen kitaplar:', this.books);
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

  loadFilterData(): void {
    forkJoin({
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses) => {
        if (responses.authors?.isSuccess) {
          this.authors = responses.authors.data || [];
        }
        if (responses.categories?.isSuccess) {
          this.categories = responses.categories.data || [];
        }
      },
      error: (error) => {
        console.error('Filter data yüklenirken hata:', error);
      }
    });
  }

  loadBookImages(): void {
    this.bookService.getAllBooks().subscribe(res => {
      this.books = res.data;
      this.books.forEach(book => {
        if (book.fileKey) {
          this.uploadService.getFile(book.fileKey).subscribe(file => {
            book.fileKey = `data:${file.data.fileType};base64,${file.data.base64String}`;
          });
        }
      });
    });
  }

  openBookModal(book: Book): void {
    
    this.selectedBook = book; 
    this.selectedAuthor = this.authors.find(a => a.id === book.authorId) || null;
    this.selectedCategory = this.categories.find(c => c.id === book.categoryId) || null;
    this.showModal = true;
    
    document.body.style.overflow = 'hidden';
    
    console.log('Modal açıldı:', {
      book: this.selectedBook,
      author: this.selectedAuthor,
      category: this.selectedCategory,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies
    });
  }

  closeBookModal(): void {
    this.showModal = false;
    this.selectedBook = null;
    this.selectedAuthor = null;
    this.selectedCategory = null;
    
    document.body.style.overflow = 'auto';
  }

  getAuthorName(authorId: number): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? `${author.name} ${author.surname}` : 'Yazar bulunamadı';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Kategori bulunamadı';
  }

  getAuthorFullInfo(): string {
    if (!this.selectedAuthor) return 'Yazar bilgisi bulunamadı';
    
    return `${this.selectedAuthor.name} ${this.selectedAuthor.surname}` + 
           (this.selectedAuthor.yearofBirth ? ` (${this.selectedAuthor.yearofBirth})` : '') +
           (this.selectedAuthor.placeofBirth ? ` - ${this.selectedAuthor.placeofBirth}` : '');
  }

  getAvailableCopies(bookId: number): number {
    if (!bookId) return 0;
    const book = this.books.find(b => b.id === bookId);
    const copies = book?.availableCopies || 0;
    console.log(`Kitap ID ${bookId} için mevcut kopya sayısı:`, copies);
    return copies;
  }

  getTotalCopies(bookId: number): number {
    if (!bookId) return 0;
    const book = this.books.find(b => b.id === bookId);
    return book?.totalCopies || 0;
  }

  isBookBorrowed(bookId: number): boolean {
    if (!bookId || !this.userActiveLoans) return false;
    const borrowed = this.userActiveLoans.some(loan => loan.bookId === bookId && !loan.isReturned);
    console.log(`Kitap ID ${bookId} ödünç alınmış mı:`, borrowed);
    return borrowed;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeBookModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showModal) {
      this.closeBookModal();
    }
  }

  deleteBook(id: number): void {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
          if (response && response.isSuccess) {
            this.books = this.books.filter(book => book.id !== id);
            if (this.selectedBook?.id === id) {
              this.closeBookModal();
            }
          } else {
            alert(response?.message || 'Kitap silinirken hata oluştu');
          }
        },
        error: (error) => {
          console.error('Kitap silinirken hata:', error);
          alert('Kitap silinirken hata oluştu');
        }
      });
    }
  }

  editBook(id: number): void {
    this.router.navigate(['/books/update', id]);
    this.closeBookModal();
  }

  addNewBook(): void {
    this.router.navigate(['/books/add']);
  }

  searchBooks(): void {
    this.router.navigate(['/books/search']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}