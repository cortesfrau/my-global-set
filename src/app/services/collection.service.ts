import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private tokenService: TokenService,
  ) {
    // Set the base URL for API calls
    this.apiBaseUrl = `${environment.API_URL}`;
  }

  /**
   * Create a new collection.
   * @param formData - The data to be sent in the request.
   * @returns An observable with the API response.
   */
  create(formData: Object): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/create`;
    const token = this.tokenService.get();

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

  /**
   * Delete a collection by ID.
   * @param collectionId - The ID of the collection to be deleted.
   * @returns An observable with the API response.
   */
  delete(collectionId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/delete/${collectionId}`;
    const token = this.tokenService.get();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post(apiUrl, requestOptions).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  /**
   * Get collections for a specific user.
   * @param userId - The ID of the user for whom collections are retrieved.
   * @returns An observable with the API response.
   */
  getUserCollections(userId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/user/${userId}`;
    const token = this.tokenService.get();

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

  /**
   * Get a specific collection by ID.
   * @param collectionId - The ID of the collection to retrieve.
   * @returns An observable with the API response.
   */
  getCollection(collectionId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/${collectionId}`;
    const token = this.tokenService.get();

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

  /**
   * Get the content of a specific collection by ID.
   * @param collectionId - The ID of the collection to retrieve content from.
   * @returns An observable with the API response.
   */
  getCollectionContent(collectionId: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/content/${collectionId}`;
    const token = this.tokenService.get();

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

  /**
   * Create a new collected card print.
   * @param formData - The data to be sent in the request.
   * @returns An observable with the API response.
   */
  createCollectedCardPrint(formData: Object): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collected-card-print/create`;
    const token = this.tokenService.get();

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

  /**
   * Add a printed card to a collection.
   * @param formData - The data to be sent in the request.
   * @returns An observable with the API response.
   */
  addPrintToCollection(formData: Object): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collected-card-print/create`;
    const token = this.tokenService.get();

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

  /**
   * Remove a printed card from a collection.
   * @param formData - The data to be sent in the request.
   * @returns An observable with the API response.
   */
  removePrintFromCollection(formData: Object): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collected-card-print/remove`;
    const token = this.tokenService.get();

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

  /**
   * Check if a printed card is in a collection.
   * @param collectionId - The ID of the collection to check.
   * @param scryfallId - The Scryfall ID of the printed card.
   * @returns An observable with a boolean indicating whether the card is in the collection.
   */
  isPrintInCollection(collectionId: number, scryfallId: string): Observable<boolean> {
    const apiUrl = `${this.apiBaseUrl}/collected-card-print/is-print-in-collection`;
    const token = this.tokenService.get();

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

  /**
   * Get statistics for a specific collection.
   * @param collectionId - The ID of the collection to retrieve statistics for.
   * @returns An observable with the API response.
   */
  getCollectionStats(collectionId: any): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/collection/stats/${collectionId}`;
    const token = this.tokenService.get();

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

}
