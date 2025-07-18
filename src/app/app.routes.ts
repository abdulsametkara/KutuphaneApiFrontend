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
  }

];
