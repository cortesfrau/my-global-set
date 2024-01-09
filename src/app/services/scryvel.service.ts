import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScryvelService {

  apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private tokenService: TokenService,
  ) {
    // Set the base URL for Scryfall API calls
    this.apiBaseUrl = `${environment.API_URL}/scryfall`;
  }

  /**
   * Get card details by Oracle ID from the Scryfall API.
   * @param oracleId - The Oracle ID of the card.
   * @returns An observable with the Scryfall API response for the specified card.
   */
  getCardByOracleId(oracleId: string): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/card/id/${oracleId}`;
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
