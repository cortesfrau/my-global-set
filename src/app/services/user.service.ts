import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private tokenService: TokenService
  ) {
    this.apiBaseUrl = `${environment.API_URL}`;
  }

  /**
   * Retrieves information about the authenticated user from the server.
   * @returns An observable containing the user information.
   * If an error occurs, it returns an observable with the error information.
   */
  getAuthenticated(): Observable<any> {

    if (this.tokenService.loggedIn()) {
      const apiUrl = `${this.apiBaseUrl}/auth/me`;
      const token = this.tokenService.get();

      // Construct headers with the Authorization token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Making a GET request to retrieve authenticated user information
      return this.http.get(apiUrl, { headers }).pipe(
        catchError((error) => {
          // Log the error and re-throw it
          console.error('Error in getAuthenticated:', error);
          return throwError(() => error);
        })
      );
    } else {
      // Token is missing or invalid, return an observable with an error
      return throwError(() => new Error('No token or invalid token'));
    }
  }

  /**
   * Updates user information on the server.
   * @param formData - JSON object containing user data to be updated.
   * @returns An observable representing the result of the update operation.
   * If an error occurs, it returns an observable with the error information.
   */
  update(formData: JSON): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/user/update`;
    const token = this.tokenService.get();

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    // Making a POST request to update user information
    return this.http.post(apiUrl, formData, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

}
