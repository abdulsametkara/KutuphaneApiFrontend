//author-list.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/author.model';
import Swal from 'sweetalert2';

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
  if (author && author.id) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `"${author.name} ${author.surname}" adlı yazarı silmek üzeresiniz.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sil',
      cancelButtonText: 'Vazgeç'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authorService.deleteAuthor(author.id).subscribe({
          next: (response: any) => {
            if (
              response &&
              (response.isSuccess === true || response.isSuccess === 'true' || response.message?.includes('başarıyla'))
            ) {
              this.authors = this.authors.filter(a => a.id !== author.id);

              Swal.fire({
                title: 'Silindi!',
                text: `"${author.name} ${author.surname}" adlı yazar başarıyla silindi.`,
                icon: 'success'
              });

            } else {
              Swal.fire({
                title: 'Hata!',
                text: response.message || 'Yazar silinirken hata oluştu.',
                icon: 'error'
              });
            }
          },
          error: () => {
            Swal.fire({
              title: 'Sunucu Hatası!',
              text: 'Yazar silinirken bir hata oluştu.',
              icon: 'error'
            });
          }
        });
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