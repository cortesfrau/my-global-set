import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Collection } from '../models/collection.interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private Token: TokenService,
    private AuthState: AuthStateService,
    private Router: Router
  ) {

    // Auth API base URL
    this.apiBaseUrl = 'http://myglobalset-back.test/api/collection';
   }


  // Create new collection
  create(formData: Object): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/create`;
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


  getUserCollections(userId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/user/${userId}`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.get(apiUrl, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  getCollection(collectionId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/${collectionId}`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.get(apiUrl, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  createCollectedCardPrint(formData: Object): Observable<any> {
    const apiUrl = `http://myglobalset-back.test/api/collected-card-print/create`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post(apiUrl, formData, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  removeCollectedCardPrint(formData: Object): Observable<any> {
    const apiUrl = `http://myglobalset-back.test/api/collected-card-print/remove`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post(apiUrl, formData, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  isPrintInCollection(collectionId: number, scryfallId: string): Observable<boolean> {
    const apiUrl = `http://myglobalset-back.test/api/collected-card-print/is-print-in-collection`;
    const token = this.Token.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    const params = {
      collection_id: collectionId.toString(),
      scryfall_id: scryfallId
    };

    return this.http.get<boolean>(apiUrl, { ...requestOptions, params }).pipe(
      catchError(this.errorHandler.handleError)
    );
  }




}
