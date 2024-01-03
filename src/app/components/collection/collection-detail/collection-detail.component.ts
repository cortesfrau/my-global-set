import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/models/card.interface';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';
import { ScryfallService } from 'src/app/services/scryfall.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, forkJoin } from 'rxjs';
import { Print } from 'src/app/models/print.interface';
import { ScryvelService } from 'src/app/services/scryvel.service';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {

  collection!: Collection;
  collectionId!: number;
  card!: Card;

  pageTitle: string = '';

  constructor(
    private scryfallService: ScryfallService,
    private collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,

    private scryvelService: ScryvelService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam !== null) {
          this.collectionId = +idParam;
        }
        return this.collectionService.getCollection(this.collectionId);
      }),
      catchError(error => {
        console.error('Error fetching collection data:', error);
        return EMPTY;
      }),
      switchMap(collection => {
        this.collection = collection;
        console.log(this.collection);
        return this.scryvelService.getCardByOracleId(collection.card_id);
      }),
      catchError(error => {
        console.error('Error fetching card data:', error);
        return EMPTY;
      }),
      switchMap(card => {
        return this.scryvelService.getCardByOracleId(card.oracle_id);
      }),
      catchError(error => {
        console.error('Error fetching card data by oracle id:', error);
        return EMPTY;
      })
    ).subscribe(card => {
      this.card = card;
      this.pageTitle = card.name;
      console.log('Card:', this.card);
    });
  }

  // loadCollectedPrints(): Observable<boolean[]> {
  //   // Limpiar el conjunto antes de cargar
  //   this.collectedPrints.clear();

  //   // Crear un array de observables para cada impresión
  //   const observables: Observable<boolean>[] = this.card.prints.map(print =>
  //     this.collectionService.isPrintInCollection(this.collectionId, print.id)
  //   );

  //   // Utilizar tap para manejar las respuestas de las observables
  //   return forkJoin(observables).pipe(
  //     tap((responses: boolean[]) => {
  //       console.log('Responses:', responses);
  //     })
  //   );
  // }

  // isPrintInCollection(printId: string): boolean {
  //   return this.collectedPrints.has(printId);
  // }

  // saveOrRemoveCollectedCardPrint(print: Print): void {
  //   const formData = {
  //     scryfall_id: print.id,
  //     collection_id: this.collection.id,
  //   };

  //   const serviceCall = this.isPrintInCollection(print.id) ?
  //     this.collectionService.removeCollectedCardPrint(formData) :
  //     this.collectionService.createCollectedCardPrint(formData);

  //   serviceCall.subscribe({
  //     next: (response) => {
  //       console.log(response.message);
  //       if (this.isPrintInCollection(print.id)) {
  //         this.collectedPrints.delete(print.id);
  //       } else {
  //         this.collectedPrints.add(print.id);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error:', error);
  //     }
  //   });
  // }

  addPrintToCollection(print: Print): void {

    const data = {
      scryfall_id: print.id,
      collection_id: this.collection.id,
    };

    console.log(data);

    this.collectionService.addPrintToCollection(data).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


}

