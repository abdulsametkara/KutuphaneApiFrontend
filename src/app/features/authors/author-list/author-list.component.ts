//author-list.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/author.model';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private authorService: AuthorService, private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  deleteAuthor(author: Author): void {
    if (confirm(`"${author.name} ${author.surname}" yazarını silmek istediğinize emin misiniz?`)) {
      
      this.authorService.deleteAuthor(author.id).subscribe({
        next: (response: any) => {
          
          if (response && (response.isSuccess === true || response.isSuccess === 'true' || response.message?.includes('başarıyla'))) {
            this.authors = this.authors.filter(a => a.id !== author.id);
            

          } else {
            alert(response.message);
          }
        },
        error: (error: any) => {
          alert('Yazar silinirken bir hata oluştu');
        }
      });
    }
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authorService.getAllAuthors().subscribe({
      next: (response: ApiResponse<Author[]>) => {
        if (response && response.isSuccess) {
          this.authors = response.data || [];
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Yazarlar yüklenirken bir hata oluştu';
        this.isLoading = false;
      }
    });
  }
  
  viewAuthorDetails(author: Author): void {
    this.router.navigate(['/authors', author.id]);
  }

  searchAuthors(): void {
    this.router.navigate(['/authors/search']);
  }

  addNewAuthor(): void {
    this.router.navigate(['/authors/add']);
  }

  updateAuthor(author: Author): void {
    this.router.navigate(['/authors/update', author.id]);
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}