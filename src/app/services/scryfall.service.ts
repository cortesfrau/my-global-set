import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, forkJoin, catchError, throwError } from 'rxjs';
import { Card } from '../models/card.interface';
import { Print } from '../models/print.interface';
import { LanguagesData, SetsLanguages } from 'src/shared/languages-dictionary';
import { Language } from '../models/language.interface';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ScryfallService {

  // Base URL for the Scryfall API.
  private urlScryfallApi: string;

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
  ) {
    // Initialize the API URL.
    this.urlScryfallApi = 'https://api.scryfall.com/';
  }

  // Default language for the card data (English in this case).
  defaultLanguage: Language = LanguagesData[1];

  // Map API data to the Card interface.
  private _mapCardData(data: any, cardOracleId: string): Card {
    // Create an array of Print objects from the data provided by the API.
    const prints: Print[] = data.data.map((printData: any) => ({
      // Assigning properties from the API to the Print interface.
      id: printData.id,
      artist: printData.artist,
      set_id: printData.set_id,
      set_name: printData.set_name,
      set_code: printData.set,
      image_uri: printData.image_uris.png,
      border: printData.border_color,
      foil: printData.foil,
      nonfoil: printData.nonfoil,
      digital: printData.digital,
    }));

    // Return a Card object with the mapped data.
    return {
      oracle_id: cardOracleId,
      name: data.data[0].name,
      prints: prints,
    };
  }

  // Fetch card Oracle ID by name, useful for fuzzy searching.
  getCardOracleIdByName(cardName: string): Observable<any> {
    // Construct the API endpoint URL with the card name.
    const apiUrl = `${this.urlScryfallApi}cards/named?fuzzy=${encodeURIComponent(cardName)}`;
    return this.http.get(apiUrl).pipe(
      // Extract the Oracle ID from the response.
      map((data: any) => data.oracle_id),
      // Handle any errors that occur during the request.
      catchError(this.errorHandler.handleError)
    );
  }

  // Fetch a card by its Oracle ID.
  getCardByOracleId(cardOracleId: string): Observable<Card> {
    // Construct the API endpoint URL with the Oracle ID.
    const apiUrl = `${this.urlScryfallApi}cards/search?q=oracleid:${encodeURIComponent(cardOracleId)}&unique=prints&order=released&dir=asc`;
    return this.http.get(apiUrl).pipe(
      // Map the response data to our Card interface.
      map((data: any) => this._mapCardData(data, cardOracleId)),
    );
  }

  // Fetch a set by its ID.
  getSetById(setId: string): Observable<any> {
    // Construct the API endpoint URL with the set ID.
    const apiUrl = `${this.urlScryfallApi}sets/${encodeURIComponent(setId)}`;
    return this.http.get(apiUrl);
  }

  // Enrich card prints with extra information such as set languages and release dates.
  addExtraInfoToPrints(card: Card): Observable<Card> {
    // Map each print to an Observable to retrieve extra information.
    const observables: Observable<Print>[] = card.prints.map((print: Print) => {
      return this.getSetById(print.set_id).pipe(
        map((setInfo: any) => {
          // Add supported languages for the set to each print.
          const setLanguages = SetsLanguages[setInfo.name];
          print.languages = setLanguages
            ? setLanguages.map((languageId) => LanguagesData[languageId])
            : [this.defaultLanguage];

          // Add extra properties like set icon and release date to the print.
          print.set_icon = setInfo.icon_svg_uri;
          print.set_release_date = setInfo.released_at;

          return print; // Return the enhanced Print object.
        })
      );
    });

    // Use forkJoin to wait for all Observables to complete and then emit the updated Card.
    return forkJoin(observables).pipe(
      map((prints: Print[]) => {
        card.prints = prints; // Update the Card with the new prints.
        return card; // Emit the updated Card object.
      })
    );
  }
}
