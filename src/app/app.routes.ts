import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },

  // Book Routes 
  { 
    path: 'books',
    loadComponent: () => import('./features/books/book-list/book-list.component').then(c => c.BookListComponent)
  },
  { 
    path: 'books/add',
    loadComponent: () => import('./features/books/book-form/book-form.component').then(c => c.BookFormComponent)
  },
  {
    path: 'books/update/:id',
    loadComponent: () => import('./features/books/book-update/book-update.component').then(c => c.BookUpdateComponent)
  },
  {
    path: 'books/search',
    loadComponent: () => import('./features/books/book-search/book-search.component').then(c => c.BookSearchComponent)
  },

  // Author Routes
  { 
    path: 'authors',
    loadComponent: () => import('./features/authors/author-list/author-list.component').then(c => c.AuthorListComponent)
  },
  {
    path: 'authors/add',
    loadComponent: () => import('./features/authors/author-form/author-form.component').then(c => c.AuthorFormComponent)
  },
  {
    path: 'authors/update/:id',
    loadComponent: () => import('./features/authors/author-update/author-update.component').then(c => c.AuthorUpdateComponent)
  },
  {
    path: 'authors/search',
    loadComponent: () => import('./features/authors/author-search/author-search.component').then(c => c.AuthorSearchComponent)
  },

  // Category Routes
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/category-list/category-list.component').then(c => c.CategoryList)
  },
  {
    path: 'categories/add',
    loadComponent: () => import('./features/categories/category-form/category-form.component').then(c => c.CategoryForm)
  },
  {
    path: 'categories/search',
    loadComponent: () => import('./features/categories/category-search/category-search.component').then(c => c.CategorySearchComponent)
  },
  {
    path: 'categories/update/:id',
    loadComponent: () => import('./features/categories/category-update/category-update.component').then(c => c.CategoryUpdateComponent)
  }

];
