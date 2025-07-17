import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'  // styleUrls yerine styleUrl kullanın (Angular 17+)
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Kullanıcı adı ve şifre gereklidir.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = {
      username: this.username,
      password: this.password
    };

    console.log('Giriş denemesi:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Backend yanıtı:', response);

        if (response && response.isSuccess) {
          this.successMessage = 'Giriş başarılı! Token alındı.';
          this.authService.setToken(response.data.token);

          console.log('Alınan token:', response.data.token);

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);

        } else {
          this.errorMessage = response.message || 'Giriş başarısız.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Giriş hatası:', error);

        if (error.status === 0) {
          this.errorMessage = 'Backend\'e bağlanılamıyor. Backend çalışıyor mu?';
        } else if (error.status === 400) {
          this.errorMessage = 'Kullanıcı adı veya şifre hatalı.';
        } else if (error.status === 500) {
          this.errorMessage = 'Sunucu hatası. Backend loglarını kontrol edin.';
        } else {
          this.errorMessage = `Hata: ${error.status} - ${error.message}`;
        }

        this.isLoading = false;
      }
    });
  }

  // Form validation helper
  isFormValid(): boolean {
    return this.username.length > 0 && this.password.length > 0;
  }

  // Clear form
  clearForm(): void {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
