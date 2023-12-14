import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlAuthApi: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private Token: TokenService,
  ) {
    // Auth API base URL
    this.urlAuthApi = 'http://myglobalset-back.test/api';
  }

  // Get authenticated user
  getAuthenticated(): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/auth/me`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getAuthenticated:', error);
        return this.errorHandler.handleError(error);
      })
    );

  }

  // Update User
  update(formData: JSON): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/user/update`;
    const token = this.Token.get();

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Agrega los encabezados a la llamada HTTP
    const requestOptions = {
      headers: headers
    };

    return this.http.post(apiUrl, formData, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

}
