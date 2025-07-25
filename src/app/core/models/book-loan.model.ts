export interface BookLoanCreateDto {
  bookId: number;
  userId: number;
  notes?: string;
}

export interface BookLoanDto {
  id: number;
  bookId?: number;
  userId?: number;
  bookTitle?: string;
  userName?: string;
  loanDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  isReturned: boolean;
  notes?: string;
  daysRemaining: number;
  isOverdue: boolean;
}
