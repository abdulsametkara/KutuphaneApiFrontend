import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookLoanService } from '../../../core/services/book-loan.service';
import { AuthService } from '../../../core/services/auth.service';

interface BookLoan {
  id: number;
  bookId: number;
  userId: number;
  bookTitle: string;
  userName: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  isReturned: boolean;
  notes?: string;
  isOverdue: boolean;
}

@Component({
  selector: 'app-book-loan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-loan-list.component.html',
  styleUrl: './book-loan-list.component.css'
})
export class BookLoanListComponent implements OnInit {
  
  bookLoans: BookLoan[] = []; 
  isLoading = true;
  errorMessage = '';

  constructor(
    private bookLoanService: BookLoanService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBookLoans();
  }

  loadBookLoans(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookLoanService.getAllBookLoans().subscribe({
      next: (response) => {
        console.log('Ödünç listesi yanıtı:', response);
        
        if (Array.isArray(response)) {
          this.bookLoans = response;
          console.log('Direkt array geldi:', this.bookLoans);
        } else {
          const isSuccess = (response as any).isSuccess || (response as any).success;
          if (isSuccess) {
            this.bookLoans = (response as any).data || (response as any).Data || [];
            console.log('Wrapped response geldi:', this.bookLoans);
          } else {
            this.errorMessage = 'Ödünç listesi yüklenemedi';
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ödünç listesi yüklenirken hata:', error);
        this.errorMessage = 'Ödünç listesi yüklenirken bir hata oluştu';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  }

  isOverdue(expectedReturnDate: string, isReturned: boolean): boolean {
    if (isReturned) return false;

    const today = new Date();
    const expectedDate = new Date(expectedReturnDate);
    return today > expectedDate;
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  refreshList(): void {
    this.loadBookLoans();
  }
} 