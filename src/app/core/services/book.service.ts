//book service kısmı. Angular'da backend API ile konuşmak için kullanılır.
// Kullanıcı kitap listesi görmek, yeni kitap eklemek, silmek istediğinde bu servis devreye girer.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Book, BookCreateDto, BookUpdateDto } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
    private apiUrl = environment.apiUrl;    
    constructor(private http: HttpClient) { }
    
    getAllBooks(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/Book/ListAll`, { headers });
    }
    
    getBookById(id: number): Observable<BookUpdateDto> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<BookUpdateDto>(`${this.apiUrl}/Book/GetById?id=${id}`, { headers });
    }
    
    createBook(book: BookCreateDto): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post(`${this.apiUrl}/Book/Create`, book, { headers });
    }
    
    updateBook(book: BookUpdateDto): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put(`${this.apiUrl}/Book/Update`, book, { headers });
    }
    
    deleteBook(id: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.delete(`${this.apiUrl}/Book/Delete?id=${id}`, { headers });
    }

    getBooksByCategory(categoryId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/Book/GetBooksByCategoryId?categoryId=${categoryId}`, { headers });
    }

    getBooksByAuthor(authorId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/Book/GetBooksByAuthorId?authorId=${authorId}`, { headers });
    }

    getBookDescriptionFromRedis(bookId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/Book/${bookId}/description`, { headers }).pipe(
        tap(response => {
            console.log('Redis Description Response:', response);
         }),
    catchError(error => {
        console.error('Redis Description Error:', error);
        return throwError(() => error);
        })
    );
    }

    clearBookCache(bookId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.delete(`${this.apiUrl}/books/${bookId}/cache`, { headers });
    }


    checkBookCacheExists(bookId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.apiUrl}/books/${bookId}/cache/exists`, { headers });
    }
}