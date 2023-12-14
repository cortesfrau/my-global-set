import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  urlAuthApi: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private Token: TokenService,
    private AuthState: AuthStateService,
    private Router: Router
  ) {

    // Auth API base URL
    this.urlAuthApi = 'http://myglobalset-back.test/api/collection';
   }



  // Create new collection
  create(formData: Object): Observable<any> {
    const apiUrl = `${this.urlAuthApi}/create`;
    const token = this.Token.get();

    console.log(formData);

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
