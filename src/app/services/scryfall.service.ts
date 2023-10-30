import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, forkJoin, expand, of, reduce, catchError, throwError } from 'rxjs';

import { Card } from '../models/card.interface';
import { Print } from '../models/print.interface';

import { LanguagesData, SetsLanguages } from 'src/shared/languages-dictionary';

import { Language } from '../models/language.interface';

@Injectable({
  providedIn: 'root'
})
export class scryfallService {

  private urlScryfallApi: string;

  constructor(private http: HttpClient) {

    this.urlScryfallApi = 'https://api.scryfall.com/';

  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  // Define the default language (English) here or load it from your language data
  defaultLanguage: Language = LanguagesData[1];

  private _mapCardData(data: any, cardOracleId: string): Card {
    const prints: Print[] = data.data.map((printData: any) => ({
      id: printData.id,
      artist: printData.artist,
      set_id: printData.set_id,
      set_name: printData.set_name,
      set_code: printData.set,
      image_uri: printData.image_uris.png,
      border_color: printData.border_color,
    }));

    return {
      oracle_id: cardOracleId,
      name: data.data[0].name,
      prints: prints,
    };
  }

  // Get card Oracle ID by name
  getCardOracleIdByName(cardName: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}cards/named?fuzzy=${encodeURIComponent(cardName)}`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => {
        return data.oracle_id;
      }),
      catchError(this.handleError)
    );
  }

  // Get card by Oracle ID
  getCardByOracleId(cardOracleId: string): Observable<Card> {
    const apiUrl = `${this.urlScryfallApi}cards/search?q=oracleid:${encodeURIComponent(cardOracleId)}&unique=prints&order=released&dir=asc`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => this._mapCardData(data, cardOracleId)),
    );
  }

  /**
   * Get Magic Set by ID
   * @param setId
   * @returns
   */
  getSetById(setId: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}sets/${encodeURIComponent(setId)}`;
    return this.http.get(apiUrl);
  }

  /**
   * Add extra info to the card instance
   * @param card
   * @returns
   */
  addExtraInfoToPrints(card: Card): Observable<Card> {
    const observables: Observable<Print>[] = card.prints.map((print: Print) => {
      return this.getSetById(print.set_id).pipe(
        map((setInfo: any) => {

          // Add the set's supported languages based on its name
          const setLanguages = SetsLanguages[setInfo.name];
          if (setLanguages) {
            print.languages = setLanguages.map((languageId) => LanguagesData[languageId]);
          } else {
            print.languages = [this.defaultLanguage];
          }

          // Add other properties to the print
          print.set_icon = setInfo.icon_svg_uri;
          print.has_foil = !setInfo.nonfoil_only;
          print.set_release_date = setInfo.released_at;

          return print; // Return the updated Print object
        })
      );
    });

    // Combine all the observables into one and emit the updated Card
    return forkJoin(observables).pipe(
      map((prints: Print[]) => {
        card.prints = prints; // Assign the updated prints to the Card
        return card; // Return the updated Card
      })
    );
  }


}
