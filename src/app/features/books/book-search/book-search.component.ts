// book-search.component.ts
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
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {

  searchTitle = '';
  selectedAuthorId = 0;
  selectedCategoryId = 0;
  
  books: Book[] = [];
  allBooks: Book[] = [];
  authors: Author[] = [];
  categories: Category[] = [];
  
  isLoading = false;
  isSearching = false;
  errorMessage = '';

  showModal = false;
  selectedBook: Book | null = null;
  selectedAuthor: Author | null = null;
  selectedCategory: Category | null = null;
  isBorrowing = false;
  userActiveLoans: any[] = [];
  imageUrls: { [key: string]: string } = {};

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private uploadService: UploadService,
    private bookLoanService: BookLoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadUserActiveLoans();
  }

  loadFilterOptions(): void {
    this.isLoading = true;
    
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

    if (this.selectedAuthorId > 0) {
      this.bookService.getBooksByAuthor(this.selectedAuthorId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
            console.log('📚 Arama sonucu kitaplar:', this.books);
            this.books.forEach(book => {
              console.log(`📖 ${book.title} - FileKey: ${book.fileKey}`);
              if (book.fileKey) {
                this.loadBookImage(book.fileKey);
              }
            });
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

    else if (this.selectedCategoryId > 0) {
      this.bookService.getBooksByCategory(this.selectedCategoryId).subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            this.books = response.data;
            console.log('📚 Kategori arama sonucu kitaplar:', this.books);
            this.books.forEach(book => {
              console.log(`📖 ${book.title} - FileKey: ${book.fileKey}`);
              if (book.fileKey) {
                this.loadBookImage(book.fileKey);
              }
            });
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

    else if (this.searchTitle.trim()) {
      this.bookService.getAllBooks().subscribe({
        next: (response: any) => {
          if (response && response.isSuccess) {
            const allBooks = response.data;

            this.books = allBooks.filter((book: any) => 
              book.title.toLowerCase().includes(this.searchTitle.toLowerCase())
            );
            console.log('📚 Başlık arama sonucu kitaplar:', this.books);
            this.books.forEach(book => {
              console.log(`📖 ${book.title} - FileKey: ${book.fileKey}`);
              if (book.fileKey) {
                this.loadBookImage(book.fileKey);
              }
            });
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

  loadUserActiveLoans(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.bookLoanService.getUserActiveLoans(currentUser.id).subscribe({
        next: (response) => {
          console.log('getUserActiveLoans response:', response);
          if (Array.isArray(response)) {
            this.userActiveLoans = response;
          } else {
            const isSuccess = (response as any).isSuccess || (response as any).success;
            if (isSuccess) {
              this.userActiveLoans = (response as any).data || (response as any).Data || [];
            } else {
              this.userActiveLoans = [];
            }
          }
        },
        error: (error) => {
          console.error('Aktif ödünç kitaplar yüklenirken hata:', error);
          this.userActiveLoans = [];
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

    this.bookLoanService.createBookLoan(borrowData).subscribe({
      next: (response) => {
        const isSuccess = (response as any).isSuccess || response.success;
        if (isSuccess) {
          alert('Kitap başarıyla ödünç alındı! 📚');
          this.loadUserActiveLoans();
          this.closeBookModal();
        } else {
          const message = (response as any).message || response.message || 'Bilinmeyen hata';
          alert('Hata: ' + message);
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

  openBookModal(book: Book): void {
    this.selectedBook = book; 
    this.selectedAuthor = this.authors.find(a => a.id === book.authorId) || null;
    this.selectedCategory = this.categories.find(c => c.id === book.categoryId) || null;
    this.showModal = true;
    
    document.body.style.overflow = 'hidden';
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
    return book?.availableCopies || 0;
  }

  getTotalCopies(bookId: number): number {
    if (!bookId) return 0;
    const book = this.books.find(b => b.id === bookId);
    return book?.totalCopies || 0;
  }

  isBookBorrowed(bookId: number): boolean {
    if (!bookId || !this.userActiveLoans) return false;
    return this.userActiveLoans.some(loan => loan.bookId === bookId && !loan.isReturned);
  }

  getBookLoan(bookId: number): any {
    if (!bookId || !this.userActiveLoans) return null;
    return this.userActiveLoans.find(loan => loan.bookId === bookId && !loan.isReturned);
  }

  returnBook(bookId: number): void {
    const loan = this.getBookLoan(bookId);
    if (!loan) {
      alert('Ödünç alma kaydı bulunamadı.');
      return;
    }

    if (confirm('Bu kitabı teslim etmek istediğinize emin misiniz?')) {
      this.bookLoanService.returnBook(loan.id).subscribe({
        next: (response) => {
          const isSuccess = (response as any).isSuccess || response.success;
          if (isSuccess) {
            alert('Kitap başarıyla teslim edildi! 📚✅');
            this.loadUserActiveLoans();
            this.closeBookModal();
          } else {
            const message = (response as any).message || response.message || 'Bilinmeyen hata';
            alert('Hata: ' + message);
          }
        },
        error: (error) => {
          console.error('Kitap teslim edilirken hata:', error);
          alert('Kitap teslim edilirken bir hata oluştu.');
        }
      });
    }
  }

  getExpectedReturnDate(bookId: number): string {
    const loan = this.getBookLoan(bookId);
    if (!loan || !loan.expectedReturnDate) return '';
    
    const date = new Date(loan.expectedReturnDate);
    return date.toLocaleDateString('tr-TR');
  }

  isOverdue(bookId: number): boolean {
    const loan = this.getBookLoan(bookId);
    if (!loan || !loan.expectedReturnDate) return false;
    
    const today = new Date();
    const expectedDate = new Date(loan.expectedReturnDate);
    return today > expectedDate;
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


  loadBookImage(fileKey: string): void {
    if (!fileKey || this.imageUrls[fileKey]) {
      return;
    }

    this.uploadService.getFile(fileKey).subscribe({
      next: (response) => {
        console.log(`🖼️ ${fileKey} resim yanıtı:`, response);
        if (response && response.isSuccess && response.data && response.data.base64String) {
          const mimeType = response.data.fileType || 'image/jpeg';
          this.imageUrls[fileKey] = `data:${mimeType};base64,${response.data.base64String}`;
          console.log(`✅ ${fileKey} resmi yüklendi`);
        } else {
          console.warn(`❌ ${fileKey} resim yüklenemedi:`, response);
        }
      },
      error: (error) => {
        console.error(`❌ ${fileKey} resim yüklenirken hata:`, error);
      }
    });
  }

  getImageUrl(fileKey: string | undefined): string | null {
    if (!fileKey) return null;
    return this.imageUrls[fileKey] || null;
  }

  hasImage(fileKey: string | undefined): boolean {
    return !!fileKey && !!this.imageUrls[fileKey];
  }
}