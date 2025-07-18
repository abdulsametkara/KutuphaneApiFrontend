// book-update.component.ts yapılandırması

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { BookCreateDto, BookUpdateDto } from '../../../core/models/book.model';


interface Author {
  id: number;
  name: string;
  surname: string;
  placeofBirth?: string;
  yearofBirth: number;
}

interface Category {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}


@Component({
  selector: 'app-book-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})

export class BookUpdateComponent implements OnInit {
  book: BookUpdateDto = {
    id : 0,
    title: '',
    description: '',
    countofPage: 0,
    authorId: 0,
    categoryId: 0
  };

    authors: Author[] = [
    { id: 1, name: 'Orhan', surname: 'Pamuk', yearofBirth: 1952 },
    { id: 2, name: 'Sabahattin', surname: 'Ali', yearofBirth: 1907 },
    { id: 3, name: 'Nazım', surname: 'Hikmet', yearofBirth: 1902 }
  ];
  
  categories: Category[] = [
    { id: 1, name: 'Roman' },
    { id: 2, name: 'Şiir' },
    { id: 3, name: 'Hikaye' },
    { id: 4, name: 'Klasik' }
  ];

  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  authorsLoading = true;
  categoriesLoading = true;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

// book-update.component.ts
ngOnInit(): void {
  console.log('BookUpdateComponent yüklendi!');
  
  // ✅ Loading state'lerini hemen false yap
  this.authorsLoading = false;
  this.categoriesLoading = false;
  this.isLoading = false;
  
  console.log('Authors:', this.authors);
  console.log('Categories:', this.categories);
  
  // URL'den ID parametresini al
  const id = this.route.snapshot.paramMap.get('id');
  console.log('URL\'den alınan ID:', id);
  
  if (id) {
    this.loadBookData(Number(id));
  }
  
  // isDataLoaded durumunu kontrol et
  console.log('isDataLoaded:', this.isDataLoaded);
}

  onSubmit(): void {
    if(!this.isFormValid()) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Kitap kaydediliyor: ', this.book);
    
    this.bookService.updateBook(this.book).subscribe({
      next: (response: any) => {
          if(response && response.isSuccess) {
              this.successMessage = 'Kitap başarıyla güncellendi!';
              console.log('Güncelleme başarılı:', response);
              setTimeout(() => {
                  this.router.navigate(['/books']);
              }, 2000);
          } else {
              this.errorMessage = response.message || 'Kitap güncellenemedi';
              console.error('Güncelleme hatası:', response);
          }
          this.isSubmitted = false;
      },
      error: (error: any) => {
          console.error('Kitap güncellenirken hata:', error);
          this.errorMessage = 'Kitap güncellenirken bir hata oluştu';
          this.isSubmitted = false;
      }
    });
  }

  isFormValid(): boolean {
    return this.book.title?.trim() !== '' &&
           (this.book.countofPage ?? -1) >= 0 &&
           (this.book.authorId ?? -1) >= 0 &&
           (this.book.categoryId ?? -1) >= 0 &&
           this.book.description?.trim() !== '';
  }

  clearForm(): void {
    this.book = {
      id: 0,
      title: '',
      description: '',
      countofPage: 0,
      authorId: 0,
      categoryId: 0
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitted = false;
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
  get isDataLoaded (): boolean {
    return !this.isLoading && !this.authorsLoading && !this.categoriesLoading;
  }

  loadBookData(id: number): void {
    this.isLoading = true;
    this.bookService.getBookById(id).subscribe({
      next: (response: ApiResponse<BookUpdateDto>) => {
        if (response && response.isSuccess && response.data) {
          this.book = response.data;
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Kitap bilgisi alınamadı';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Kitap bilgisi alınırken hata:', error);
        this.errorMessage = 'Kitap bilgisi alınırken bir hata oluştu';
        this.isLoading = false;
      }
    });
  }
  
}



