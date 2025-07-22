//author-update.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../core/services/author.service';
import { AuthorUpdateDto } from '../../../core/models/author.model';

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T;
    errors?: string[]; 
    statusCode?: number;
}

interface Author {
    id: number;
    name: string;
    surname: string;
    placeofBirth?: string;
    yearofBirth: number;
}

@Component({
    selector: 'app-author-update',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './author-update.component.html',
    styleUrls: ['./author-update.component.css']
})

export class AuthorUpdateComponent implements OnInit {
    author: AuthorUpdateDto = {
        id: 0,
        name: '',
        surname: '',
        placeofBirth: '',
        yearofBirth: 0
    };

    isLoading = false;
    isSubmitted = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private authorService: AuthorService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadComponentData(Number(id));
        } else {
            this.errorMessage = 'Geçersiz yazar ID\'si.';
            this.router.navigate(['/authors']);
        }
    }

    loadComponentData(authorId: number): void {
        console.log('Component verileri yükleniyor...');

        this.isLoading = true;
        this.authorService.getAuthorById(authorId).subscribe({
            next: (response: ApiResponse<Author>) => {
                if (response.isSuccess) {
                    this.author = response.data;
                } else {
                    this.errorMessage = response.message;
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Yazar bilgileri yüklenirken bir hata oluştu.';
                console.error(error);
                this.isLoading = false;
            }
        });
    }



  onSubmit(): void {
      if (!this.isFormValid()) {
          this.errorMessage = 'Lütfen tüm alanları doldurun.';
          return;
      }

      this.isSubmitted = true;
      this.errorMessage = '';
      this.successMessage = '';

      console.log('Yazar güncelleniyor:', this.author);

      this.authorService.updateAuthor(this.author).subscribe({
          next: (response: ApiResponse<Author>) => {
              if (response && response.isSuccess) {
                  this.successMessage = response.message ;
                  
                  this.clearMessages();
                  setTimeout(() => {
                      this.router.navigate(['/authors']);
                  }, 2000);
              } else {
                  this.errorMessage = response?.message;
                  this.clearMessages();
              }
              this.isSubmitted = false;
          },
          error: (error: any) => {
              this.errorMessage = error?.error?.message;
              this.isSubmitted = false;
              this.clearMessages();
          }
      });
  }

    isFormValid(): boolean {
        return this.author.name?.trim() !== '' &&
               this.author.surname?.trim() !== '' &&
               (this.author.yearofBirth ?? -1) > 0;
    }

    clearForm(): void {
        this.author = {
            id: this.author.id,
            name: '',
            surname: '',
            placeofBirth: '',
            yearofBirth: 0
        };
        this.errorMessage = '';
        this.successMessage = '';
    }

    goBack(): void {
        this.router.navigate(['/authors']);
    }

    get isDataLoaded (): boolean {
        return !this.isLoading && this.author && Object.keys(this.author).length > 0;
    }

    private clearMessages(): void {
        setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
        }, 5000);
    }

}



