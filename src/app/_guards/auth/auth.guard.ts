import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FbService } from '../../_services/fb/fb.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private fbService: FbService,
    private route: Router
  ) { }


  canActivate( 
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): boolean {

      if (this.checkLogin()) return true;
      else if (!this.checkLogin() && this.route.url === '/signup') return false;
      else {
        this.route.navigateByUrl('/login');
        return false;
      }
  }

  checkLogin() {
    return this.fbService.isAuthenticated();
  }
}
