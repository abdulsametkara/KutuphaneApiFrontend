import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BookLoanDto,BookLoanCreateDto } from "../models/book-loan.model";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable
({
  providedIn: "root"
})

export class BookLoanService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }


    getAllBookLoans(): Observable<ApiResponse<BookLoanDto[]>> {
            const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
        return this.http.get<ApiResponse<BookLoanDto[]>>(`${this.apiUrl}/BookLoan/GetAllLoans`, { headers });
    }

    // Yeni ödünç kitap oluştur
    createBookLoan(bookLoan: BookLoanCreateDto): Observable<ApiResponse<BookLoanDto>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<ApiResponse<BookLoanDto>>(`${this.apiUrl}/BookLoan/BorrowBook`, bookLoan, { headers });
    }


    // ReturnBook 
    returnBook(loanId: number): Observable<ApiResponse<boolean>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/BookLoan/ReturnBook/${loanId}`, null, { headers });
    }


    // GetUserActiveLoans
    getUserActiveLoans(userId: number): Observable<ApiResponse<BookLoanDto[]>> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<BookLoanDto[]>>(`${this.apiUrl}/BookLoan/GetUserActiveLoans/${userId}`, { headers });
    }
    
}
