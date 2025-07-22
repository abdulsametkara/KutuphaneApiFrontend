//author-form.component.ts yapılandırması
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthorService } from '../../../core/services/author.service';
import { AuthorCreateDto } from '../../../core/models/author.model';
import{ forkJoin } from 'rxjs';

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

interface Author {
  id: number;
  name: string;
  surname: string;
  placeofBirth?: string;
  yearofBirth: number;
}

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})

export class AuthorFormComponent implements OnInit {

  author: AuthorCreateDto = {
    name: '',
    surname: '',
    placeofBirth: '',
    yearofBirth: new Date().getFullYear()
  };

  authors: Author[] = [];

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  authorsLoading = true;


  constructor(private authorService: AuthorService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authorService.getAllAuthors().subscribe({
      next: (response: ApiResponse<Author[]>) => {
        if (response.isSuccess) {
          this.authors = response.data;
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {



        this.errorMessage = error.message;
      },
      complete: () => {
        this.authorsLoading = false;
        this.isLoading = false;
      }
    });
  }

    isNameValid(): boolean {
      return this.author.name.trim().length >= 2 && this.author.name.trim().length <= 50;
    }
  
    isSurnameValid(): boolean {
      return this.author.surname.trim().length >= 2 && this.author.surname.trim().length <= 50;
    }
  
    isYearValid(): boolean {
      return this.author.yearofBirth >= 1800 && this.author.yearofBirth <= 2025;
    }
  
    clearMessages(): void {
      setTimeout(() => {
        this.errorMessage = '';
        this.successMessage = '';
      }, 5000);
    }

    onSubmit(): void {
      if (!this.isFormValid()) {
        this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun.';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authorService.createAuthor(this.author).subscribe({
        next: (response: ApiResponse<Author>) => {

          if (response && response.isSuccess === true) {
            this.successMessage = response.message;
            
            if (response.data) {
              this.authors.push(response.data);
            }
             setTimeout(() => {
              this.router.navigate(['/authors']);
            }, 2000);
          } else {
            this.successMessage = response.message;
          }
          this.isSubmitting = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Yazar kaydedilirken hata oluştu.';
          this.isSubmitting = false;
        }
      });
    }

    isFormValid(): boolean {
      return this.author.name.trim() !== '' &&
             this.author.surname.trim() !== '' &&
             this.author.yearofBirth > 0;
    }

    clearForm(): void {
      this.author = {
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

    get isDataLoaded(): boolean {
    return !this.isLoading && !this.authorsLoading;
    }

}