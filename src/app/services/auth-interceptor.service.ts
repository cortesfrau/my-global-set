import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Interceptor for handling HTTP requests and responses related to authentication.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Intercept and handle HTTP requests and responses.
   * @param request - The HTTP request object.
   * @param next - The next HTTP handler in the chain.
   * @returns An observable of the HTTP event stream.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if the error status is 401 (Unauthorized)
        if (error.status === 401) {
          // Log a message and redirect to the login page
          console.log('Token expirado. Redirigiendo a la página de inicio de sesión.');

          // Log out user
          this.authService.logout();
        }

        // Re-throw the error for downstream error handling
        return throwError(() => error);
      })
    );
  }
}
