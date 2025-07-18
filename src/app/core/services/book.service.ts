//book service kısmı. Angular'da backend API ile konuşmak için kullanılır.
// Kullanıcı kitap listesi görmek, yeni kitap eklemek, silmek istediğinde bu servis devreye girer.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, BookCreateDto, BookUpdateDto } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
    private apiUrl = environment.apiUrl;    
    constructor(private http: HttpClient) { }
    
    getAllBooks(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Book/ListAll`);
    }
    
    getBookById(id: number): Observable<any> {  
        return this.http.get(`${this.apiUrl}/Book/GetById?id=${id}`);
    }
    
    createBook(book: BookCreateDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/Book/Create`, book);
    }
    
    updateBook(book: BookUpdateDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/Book/Update`, book);
    }
    
    deleteBook(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Book/Delete?id=${id}`);
    }

    getBooksByCategory(categoryId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/Book/GetBooksByCategoryId?categoryId=${categoryId}`);
    }

    getBooksByAuthor(authorId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/Book/GetBooksByAuthorId?authorId=${authorId}`);
    }

    getBooksByTitle(title: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Book/GetBooksByTitle?title=${title}`);
    }
}