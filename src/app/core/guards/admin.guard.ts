// src/app/core/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {    
    if (!this.authService.isAuthenticated()) {
      console.log('Kullanıcı giriş yapmamış');
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser();
   if (user && user.role === 'Admin') {
      console.log('Admin erişimi onaylandı');
      return true;
    }
    console.log(' Admin yetkisi yok, role:', user?.role);
    alert('Bu sayfaya erişim için admin yetkisine sahip olmalısınız.');
    this.router.navigate(['/dashboard']);
    return false;
  }
}