import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { TokenService } from './token.service';
import { Observable, catchError } from 'rxjs';

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

    this.apiBaseUrl = 'http://myglobalset-back.test/api/scryfall';
  }

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
