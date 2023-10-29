import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, expand, of, reduce } from 'rxjs';

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
      })
    );
  }

  // Get card by Oracle ID
  getCardByOracleId(cardOracleId: string): Observable<Card> {
    const apiUrl = `${this.urlScryfallApi}cards/search?q=oracleid%3A${encodeURIComponent(cardOracleId)}&unique=prints&order=released&dir=asc`;
    return this.http.get(apiUrl).pipe(
      map((data: any) => this._mapCardData(data, cardOracleId)),
    );
  }

  // Get set by ID
  getSetById(setId: string): Observable<any> {
    const apiUrl = `${this.urlScryfallApi}sets/${encodeURIComponent(setId)}`;
    return this.http.get(apiUrl);
  }

  addExtraInfoToPrints(card: Card): Observable<Card> {
    const observables: Observable<Print>[] = card.prints.map((print: Print) => {
      return this.getSetById(print.set_id).pipe(
        map((setInfo: any) => {
          // Agrega las nuevas propiedades al objeto Print
          print.set_icon = setInfo.icon_svg_uri;
          print.has_foil = !setInfo.nonfoil_only;
          print.set_release_date = setInfo.released_at;
          return print; // Devuelve el objeto Print actualizado
        })
      );
    });

    // Combina todos los observables en uno solo y emite la Card actualizada
    return forkJoin(observables).pipe(
      map((prints: Print[]) => {
        card.prints = prints; // Asigna las impresiones actualizadas a la Card
        return card; // Devuelve la Card actualizada
      })
    );
  }

}
