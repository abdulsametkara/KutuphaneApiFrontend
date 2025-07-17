import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  // Dummy data - gerçek API'lerden gelecek
  stats = {
    totalBooks: 150,
    totalAuthors: 45,
    totalCategories: 12,
    borrowedBooks: 23
  };

  recentBooks = [
    { title: 'Suç ve Ceza', author: 'Dostoyevski', category: 'Klasik' },
    { title: 'Simyacı', author: 'Paulo Coelho', category: 'Roman' },
    { title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali', category: 'Türk Edebiyatı' },
    { title: '1984', author: 'George Orwell', category: 'Distopya' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Dashboard component yüklendi!');
    console.log('Token mevcut:', !!this.authService.getToken());

    this.loadUserInfo();

    // Simulated loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  loadUserInfo(): void {
    const token = this.authService.getToken();
    if (token) {
      // JWT token'ı decode etmeyi daha sonra ekleyeceğiz
      this.currentUser = {
        username: 'Admin Kullanıcı', // Token'dan gelecek
        role: 'Admin' // Token'dan gelecek
      };
    }
  }

  logout(): void {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  navigateTo(route: string): void {
    console.log(`${route} sayfasına yönlendiriliyor...`);
    alert(`${route} sayfası henüz oluşturulmadı! Sonraki adımda ekleyeceğiz.`);
    // this.router.navigate([route]);
  }

  // Refresh stats (API'den veri çekme simülasyonu)
  refreshStats(): void {
    this.isLoading = true;
    console.log('İstatistikler yenileniyor...');

    setTimeout(() => {
      // Simulated API call
      this.stats = {
        totalBooks: Math.floor(Math.random() * 200) + 100,
        totalAuthors: Math.floor(Math.random() * 60) + 30,
        totalCategories: Math.floor(Math.random() * 20) + 10,
        borrowedBooks: Math.floor(Math.random() * 50) + 10
      };
      this.isLoading = false;
    }, 800);
  }
}
