import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';

import { Card } from '../models/card.interface';
import { Print } from '../models/print.interface';

@Injectable({
  providedIn: 'root'
})
export class scryfallService {

  private urlScryfallApi: string;

  constructor(private http: HttpClient) {
    this.urlScryfallApi = 'https://api.scryfall.com/';
  }


  // Mapping data to Card interface
  private mapCardData(data: any, cardOracleId: string): Card {
    const prints: Print[] = data.data

      // Filter non digital prints
      .filter((printData: any) => printData.digital === false)

      // Filter non foil prints
      .filter((printData: any) => printData.foil === false)

      // Map the data
      .map((printData: any) => ({
        id: printData.id,
        set_id: printData.set_id,
        set_name: printData.set_name,
        set_code: printData.set,
        image_uri: printData.image_uris.png,
        border_color: printData.border_color,
      })
    );

    return {
      oracle_id: cardOracleId,
      name: data.data[0].name,
      prints: prints
    };
  }

  // Get card Oracle ID by name
  getCardOracleIdByName(cardName: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}cards/named?fuzzy=${encodeURIComponent(cardName)}`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => {
        return data.oracle_id;
      })
    );
  }

  // Get card by Oracle ID
  getCardByOracleId(cardOracleId: string): Observable<Card> {
    const apiUrl = `${this.urlScryfallApi}cards/search?q=oracleid%3A${encodeURIComponent(cardOracleId)}&unique=prints&order=released&dir=asc`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => this.mapCardData(data, cardOracleId)),
    );
  }

  // Get set by ID
  getSetById(setId: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}sets/${encodeURIComponent(setId)}`;
    return this.http.get(apiUrl);
  }

  addExtraInfoToPrints(prints: Print[]): Observable<Print[]> {
    const observables: Observable<Print>[] = [];

    // Recorre los prints y agrega observables para obtener información del conjunto
    prints.forEach((print: Print) => {
      const observable = this.getSetById(print.set_id).pipe(
        map((setInfo: any) => {
          // Agrega la propiedad set_code a cada print
          print.set_icon = setInfo.icon_svg_uri;
          print.has_foil = !setInfo.nonfoil_only;
          return print; // Devuelve el print actualizado
        })
      );
      observables.push(observable);
    });

    // Combina todos los observables en uno solo y emite la matriz actualizada de prints
    return forkJoin(observables);
  }


}
