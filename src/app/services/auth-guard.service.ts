import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private token: TokenService, private router: Router) { }

  /**
   * Method implementing the canActivate logic for route protection.
   * @param route The currently activated route.
   * @param state The current state of the route.
   * @returns A boolean value, a UrlTree, an Observable, or a Promise indicating whether navigation should continue.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // Check if the user is authenticated using the token service.
    const isAuthenticated = this.token.loggedIn();

    // Check if the route has 'authGuardType' configured.
    if (route.data && route.data['authGuardType']) {
      // Handle 'beforeLogin' and 'afterLogin' scenarios as needed.
      if (route.data['authGuardType'] === 'beforeLogin') {
        // Redirect to the home page if already authenticated.
        if (isAuthenticated) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      } else if (route.data['authGuardType'] === 'afterLogin') {
        // Redirect to the login page if not authenticated.
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
    }

    // Allow navigation by default if no specific scenario is handled.
    return true;
  }
}
