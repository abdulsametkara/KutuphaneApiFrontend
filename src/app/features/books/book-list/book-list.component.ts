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
import Swal from 'sweetalert2';

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

  isLoadingDescription = false;
  redisDescription: string = '';

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
          console.log('getUserActiveLoans response:', response);
          // Backend IsSuccess kullanıyor, frontend success bekliyor
          const isSuccess = (response as any).isSuccess || response.success;
          if (isSuccess) {
            // Backend Data kullanıyor, frontend data bekliyor  
            this.userActiveLoans = (response as any).data || (response as any).Data || [];
            console.log('Kullanıcı aktif ödünç kitapları:', this.userActiveLoans);
          } else {
            console.log('Aktif ödünç kitap bulunamadı.');
            this.userActiveLoans = [];
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
      Swal.fire({
          title: "Tebrikler!",
          text: "Kitap başarıyla ödünç alındı!",
          icon: "success"
        });
      return;
    }

    if (book.availableCopies <= 0) {
      Swal.fire({
          title: "Hata!",
          text: "Bu kitap şu anda mevcut değil.",
          icon: "error"
        });
      return;
    }

    if (this.isBookBorrowed(book.id)) {
      Swal.fire({
          title: "Hata!",
          text: "Bu kitabı zaten ödünç almışsınız.",
          icon: "error"
        });
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
        
        // Backend IsSuccess kullanıyor, frontend success bekliyor
        const isSuccess = (response as any).isSuccess || response.success;
        if (isSuccess) {
          
          Swal.fire({
          title: "Tebrikler!",
          text: "Kitap başarıyla ödünç alındı!",
          icon: "success"
        });
          
          // UI'yi güncelle
          this.loadBooks();
          this.loadUserActiveLoans();
          
          // Modal'ı kapat
          this.closeBookModal();
          
        } else {
          const message = (response as any).message || response.message || 'Bilinmeyen hata';
          Swal.fire({
            title: "Hata!",
            text: message,
            icon: "error"
          });
        }
        this.isBorrowing = false;
        
      },
      error: (error) => {
        console.error('Kitap ödünç alınırken hata:', error);
        Swal.fire({
          title: "Hata!",
          text: "Kitap ödünç alınırken bir hata oluştu.",
          icon: "error"
        });
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
    this.loadBookDescriptionFromRedis(book.id);

    document.body.style.overflow = 'hidden';
    
    console.log('Modal açıldı:', {
      book: this.selectedBook,
      author: this.selectedAuthor,
      category: this.selectedCategory,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies
    });
  }

  loadBookDescriptionFromRedis(bookId: number): void {
    this.isLoadingDescription = true;
    this.redisDescription = '';

    console.log(`🔄 Redis'ten kitap ${bookId} açıklaması çekiliyor...`);

    this.bookService.getBookDescriptionFromRedis(bookId).subscribe({
      next: (response) => {
        console.log('📥 Redis Response:', response);
        
        if (response.isSuccess) {
          this.redisDescription = response.data || 'Açıklama bulunamadı';
          
          if (response.message?.includes('cache')) {
            console.log('CACHE HIT: Açıklama Redis\'ten geldi! (Süper hızlı)');
          } else if (response.message?.includes('DB')) {
            console.log('CACHE MISS: Açıklama DB\'den geldi ve cache\'lendi');
          }
        } else {
          this.redisDescription = response.message || 'Açıklama bulunamadı';
          console.error('Redis Error:', response.message);
        }
        
        this.isLoadingDescription = false;
      },
      error: (error) => {
        console.error('Redis API Error:', error);
        this.redisDescription = this.selectedBook?.description || 'Açıklama yüklenemedi';
        this.isLoadingDescription = false;
      }
    });
  }

  closeBookModal(): void {
    this.showModal = false;
    this.selectedBook = null;
    this.selectedAuthor = null;
    this.selectedCategory = null;
    this.isLoadingDescription = false;
    this.redisDescription = '';
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

  // Kitabın ödünç alındığı loan bilgisini getir
  getBookLoan(bookId: number): any {
    if (!bookId || !this.userActiveLoans) return null;
    return this.userActiveLoans.find(loan => loan.bookId === bookId && !loan.isReturned);
  }

  // Kitap teslim etme
  returnBook(bookId: number): void {
    const loan = this.getBookLoan(bookId);
    if (!loan) {
      Swal.fire({
        title: "Hata!",
        text: "Ödünç alma kaydı bulunamadı.",
        icon: "error"
      });
      return;
    }

    if (!loan.isReturned) {
      this.bookLoanService.returnBook(loan.id).subscribe({
        next: (response) => {
          console.log('Kitap teslim etme yanıtı:', response);
          
          // Backend IsSuccess kullanıyor
          const isSuccess = (response as any).isSuccess || response.success;
          if (isSuccess) {
            Swal.fire({
              title: "Tebrikler!",
              text: "Kitap başarıyla teslim edildi!",
              icon: "success"
            });

            // UI'yi güncelle
            this.loadBooks();
            this.loadUserActiveLoans();
            
            // Modal'ı kapat
            this.closeBookModal();
            
          } else {
            const message = (response as any).message || response.message || 'Bilinmeyen hata';
            Swal.fire({
              title: "Hata!",
              text: message,
              icon: "error"
            });
          }
        },
        error: (error) => {
          console.error('Kitap teslim edilirken hata:', error);
          Swal.fire({
            title: "Hata!",
            text: "Kitap teslim edilirken bir hata oluştu.",
            icon: "error"
          });
        }
      });
    }
  }

  // Teslim edilmesi gereken tarihi formatla
  getExpectedReturnDate(bookId: number): string {
    const loan = this.getBookLoan(bookId);
    if (!loan || !loan.expectedReturnDate) return '';
    
    const date = new Date(loan.expectedReturnDate);
    return date.toLocaleDateString('tr-TR');
  }

  // Kitabın geç teslim edilip edilmediğini kontrol et
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
  Swal.fire({
    title: 'Emin misiniz?',
    text: 'Bu kitabı silmek istediğinize emin misiniz?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sil',
    cancelButtonText: 'Vazgeç'
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
          if (response && response.isSuccess) {
            this.books = this.books.filter(book => book.id !== id);
            if (this.selectedBook?.id === id) {
              this.closeBookModal();
            }
            Swal.fire('Silindi!', 'Kitap başarıyla silindi.', 'success');
          } else {
            Swal.fire('Hata', response?.message || 'Kitap silinirken hata oluştu', 'error');
          }
        },
        error: (error) => {
          console.error('Kitap silinirken hata:', error);
          Swal.fire('Hata', 'Kitap silinirken sunucu hatası oluştu.', 'error');
        }
      });
    }
  });
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

  // 🆕 Ödünç İşlemleri sayfasına git
  goToLoanList(): void {
    this.router.navigate(['/books/loans']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}