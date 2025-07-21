// dashboard.component.ts - Real API Integration
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { CategoryService } from '../../core/services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;

  // ✅ Gerçek API'den gelecek
  stats = {
    totalBooks: 0,
    totalAuthors: 0,
    totalCategories: 0

  };

  // ✅ Gerçek API'den gelecek
  recentBooks: any[] = [];

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Dashboard component yüklendi!');
    console.log('Token mevcut:', !!this.authService.getToken());

    this.loadUserInfo();
    this.loadDashboardData();
  }

  loadUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUser = {
        username: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      };
      console.log('Giriş yapan kullanıcı:', this.currentUser);
    } else {
      // Token yoksa veya geçersizse login'e yönlendir
      this.router.navigate(['/login']);
    }
  }

  // ✅ Dashboard verilerini gerçek API'den çek
  loadDashboardData(): void {
    console.log('Dashboard verileri yükleniyor...');
    this.isLoading = true;

    // ✅ Tüm API çağrılarını paralel olarak yap
    forkJoin({
      books: this.bookService.getAllBooks(),
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses) => {
        console.log('API responses:', responses);

        // ✅ İstatistikleri güncelle
        this.stats = {
          totalBooks: responses.books.isSuccess ? responses.books.data.length : 0,
          totalAuthors: responses.authors.isSuccess ? responses.authors.data.length : 0,
          totalCategories: responses.categories.isSuccess ? responses.categories.data.length : 0,
        };

        // ✅ Son eklenen kitapları al (ilk 4 kitap)
        if (responses.books.isSuccess) {
          this.recentBooks = responses.books.data
            .slice(0, 4)
            .map((book: any) => ({
              id: book.id,
              title: book.title,
              authorName: this.getAuthorName(book.authorId, responses.authors.data),
              categoryName: this.getCategoryName(book.categoryId, responses.categories.data)
            }));
        }

        console.log('Dashboard verileri yüklendi:', {
          stats: this.stats,
          recentBooks: this.recentBooks
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard verileri yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  // ✅ Yazar adını bul
  getAuthorName(authorId: number, authors: any[]): string {
    const author = authors.find(a => a.id === authorId);
    return author ? `${author.name} ${author.surname}` : 'Bilinmeyen Yazar';
  }

  // ✅ Kategori adını bul
  getCategoryName(categoryId: number, categories: any[]): string {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Bilinmeyen Kategori';
  }

  logout(): void {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // ✅ Gerçek API'den refresh
  refreshStats(): void {
    console.log('İstatistikler yenileniyor...');
    this.loadDashboardData();
  }
}