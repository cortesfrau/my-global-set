import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';
import { Router } from '@angular/router';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlAuthApi: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private Token: TokenService,
    private AuthState: AuthStateService,
    private Router: Router
  ) {
    this.urlAuthApi = `${environment.API_URL}/auth`;
  }

  /**
   * Log in a user.
   * @param formData - User login data.
   * @returns An observable with the login response.
   */
  login(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/login`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  /**
   * Sign up a new user.
   * @param formData - User signup data.
   * @returns An observable with the signup response.
   */
  signup(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/signup`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  /**
   * Log out the current user.
   */
  logout() {
    this.AuthState.changeAuthStatus(false);
    this.Token.remove();
    this.Router.navigateByUrl('/login');
  }

  /**
   * Send a password reset link to the user's email.
   * @param formData - User email for sending the reset link.
   * @returns An observable with the response to the reset link request.
   */
  sendPasswordResetLink(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/send-password-reset-link`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  /**
   * Change the user's password.
   * @param formData - User data for changing the password.
   * @returns An observable with the response to the password change request.
   */
  changePassword(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/change-password`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}
