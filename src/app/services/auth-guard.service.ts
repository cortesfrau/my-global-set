import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private token: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuthenticated = this.token.loggedIn();

    if (route.data && route.data['authGuardType']) {
      if (route.data['authGuardType'] === 'beforeLogin') {
        if (isAuthenticated) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      } else if (route.data['authGuardType'] === 'afterLogin') {
        if (!isAuthenticated) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }
    }

    return true;
  }
}
