import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlAuthApi: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private Token: TokenService,
    private AuthState: AuthStateService
  ) {
    // Inicializa la URL de la API.
    this.urlAuthApi = 'http://myglobalset-back.test/api/auth';
  }

  // Log In Method
  login(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/login`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  // Sign Up Method
  signup(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/signup`;

    return this.http.post(apiUrl, formData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  // Log Out Method
  logout() {
    this.AuthState.changeAuthStatus(false);
    this.Token.remove();
  }
}
