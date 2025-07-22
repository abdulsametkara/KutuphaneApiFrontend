// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { CategoryService } from '../../core/services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;


  permissions = {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewStats: false
  };


  stats = {
    totalBooks: 0,
    totalAuthors: 0,
    totalCategories: 0
  };


  books: any[] = [];
  authors: any[] = [];
  categories: any[] = [];


  searchQuery = '';
  selectedCategoryId = 0;
  selectedAuthorId = 0;
  activeTab = 'books';
  

  filteredBooks: any[] = [];
  filteredAuthors: any[] = [];
  filteredCategories: any[] = [];

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Dashboard component yüklendi!');
    this.loadUserInfo();
    this.setUserPermissions();
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
      this.router.navigate(['/login']);
    }
  }

  setUserPermissions(): void {
    const userRole = this.currentUser?.role.toLowerCase();
    
    switch (userRole) {
      case 'admin':
        this.permissions = {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canViewStats: true
        };
        break;

      case 'user':
      default:
        this.permissions = {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canViewStats: false
        };
        break;
    }
    console.log('Permissions:', this.permissions);
  }

  loadDashboardData(): void {
    console.log('Dashboard verileri yükleniyor...');
    this.isLoading = true;

    forkJoin({
      books: this.bookService.getAllBooks(),
      authors: this.authorService.getAllAuthors(),
      categories: this.categoryService.getAllCategories()
    }).subscribe({
      next: (responses) => {

        this.books = responses.books.isSuccess ? responses.books.data : [];
        this.authors = responses.authors.isSuccess ? responses.authors.data : [];
        this.categories = responses.categories.isSuccess ? responses.categories.data : [];
        if (this.permissions.canViewStats) {
          this.stats = {
            totalBooks: this.books.length,
            totalAuthors: this.authors.length,
            totalCategories: this.categories.length
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}