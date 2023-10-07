import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class scryfallService {

  private urlScryfallApi: string;

  constructor(private http: HttpClient) {
    this.urlScryfallApi = 'https://api.scryfall.com/cards/';
  }

  getCardByName(cardName: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}named?fuzzy=${encodeURIComponent(cardName)}`;
    return this.http.get(apiUrl);
  }

  getCardVersionsByOracleId(cardOracleId: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}search?q=oracleid%3A${encodeURIComponent(cardOracleId)}&unique=prints`;
    return this.http.get(apiUrl);
  }

}
