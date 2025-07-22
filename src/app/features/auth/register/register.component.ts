// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  surname = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {

    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';


    const newUser = {
      name: this.name,
      surname: this.surname,
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        
        if (response && response.isSuccess) {
          this.successMessage = response.message;
          
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: {
                message: this.successMessage
              }
            });
          }, 500);
          
        } else {
          this.errorMessage = response.message || 'Kayıt işlemi başarısız.';
            
        }
      },
      error: (error) => {
        
        if (error.status === 400) {
          this.errorMessage = 'Bu kullanıcı adı veya e-posta zaten kullanılıyor.';
        } else if (error.status === 0) {
          this.errorMessage = 'Backend\'e bağlanılamıyor. Backend çalışıyor mu?';
        } else {
          this.errorMessage = error.error?.message || 'Bir hata oluştu.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  isFormValid(): boolean {
    if (!this.name || !this.surname || !this.username || !this.password) {
      this.errorMessage = 'Tüm zorunlu alanları doldurun.';
      return false;
    }

    if (this.username.length < 3) {
      this.errorMessage = 'Kullanıcı adı en az 3 karakter olmalıdır.';
      return false;
    }

    if (this.password.length <= 2) {
      this.errorMessage = 'Şifre en az 2 karakter olmalıdır.';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return false;
    }
    return true;
  }

  clearForm(): void {
    this.name = '';
    this.surname = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}