//author-search.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../core/services/author.service';

@Component({
  selector: 'app-author-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './author-search.component.html',
  styleUrls: ['./author-search.component.css']
})

export class AuthorSearchComponent implements OnInit {
    // Search criteria
    searchName = '';
    searchId: number | null = null;
    
    // Results
    authors: any[] = [];
    
    // States
    isLoading = false;
    isSearching = false;
    errorMessage = '';
    
    constructor(
        private authorService: AuthorService,
        private router: Router
    ) {}
    
    ngOnInit(): void {
    }
    

    
    searchAuthors(): void {
        // Arama kriterlerini kontrol et
        if (!this.searchName.trim() && !this.searchId) {
            this.errorMessage = 'Lütfen yazar adı veya ID girin.';
            return;
        }

        this.isSearching = true;
        this.errorMessage = '';

        // ID ile arama öncelikli
        if (this.searchId && this.searchId > 0) {
            this.authorService.getAuthorById(this.searchId).subscribe({
                next: (response: any) => {
                    if (response && response.isSuccess && response.data) {
                        // Başarılı ve data var
                        this.authors = [response.data];
                    } else {

                        this.errorMessage = response.message;
                        this.authors = [];
                    }
                    this.isSearching = false;
                },
                error: (error) => {
                    this.errorMessage = 'Backend ile bağlantı kurulamadı.';
                    this.authors = [];
                    this.isSearching = false;
                }
            });
        }
        // İsim ile arama
        else if (this.searchName.trim()) {
            this.authorService.getAuthorByName(this.searchName).subscribe({
                next: (response: any) => {
                    if (response && response.isSuccess && response.data && response.data.length > 0) {
                        // Başarılı ve data var
                        this.authors = response.data;
                    } else {
                        // Başarılı ama data yok VEYA başarısız
                        this.errorMessage = response.message;
                        this.authors = [];
                    }
                    this.isSearching = false;
                },
                error: (error) => {
                    this.errorMessage = 'Backend ile bağlantı kurulamadı.';
                    this.authors = [];
                    this.isSearching = false;
                }
            });
        }
    }

    clearSearch(): void {
        this.searchName = '';
        this.searchId = null;
        this.authors = [];
        this.errorMessage = '';
    }

    editAuthor(authorId: number): void {
        this.router.navigate(['/authors/update', authorId]);
    }

    goBack(): void {
        this.router.navigate(['/authors']);
    }
}