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
  styleUrl: './login.component.css'
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
      this.errorMessage ;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response && response.isSuccess) {
          this.successMessage = response.message;
          this.authService.setToken(response.data);
          this.router.navigate(['/dashboard']);

        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {


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

  isFormValid(): boolean {
    return this.username.length > 0 && this.password.length > 0;
  }

  clearForm(): void {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
  goToRegister(): void {
  this.router.navigate(['/register']);
}

  showRegisterAlert(): void {
    alert('Kayıt sayfası henüz oluşturulmadı');
  }

}
