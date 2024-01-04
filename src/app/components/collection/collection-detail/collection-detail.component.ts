import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Card } from 'src/app/models/card.interface';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
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

  /** Tell if there is a current api call */
  isLoading: boolean = true;

  constructor(
    private collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    private scryvelService: ScryvelService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap.pipe(
      switchMap(params => this.handleParams(params)),
      catchError(error => this.handleParamsError(error)),
      switchMap(collection => this.handleCollection(collection)),
      catchError(error => this.handleCollectionError(error)),
    ).subscribe(
      card => this.handleCard(card)
    );
  }

  private handleParams(params: ParamMap): Observable<Collection> {
    const idParam = params.get('id');
    if (idParam !== null) {
      this.collectionId = +idParam;
    }
    return this.collectionService.getCollection(this.collectionId);
  }

  private handleCollection(collection: Collection): Observable<Card> {
    this.collection = collection;
    return this.scryvelService.getCardByOracleId(collection.card_id);
  }

  private handleCard(card: Card): void {
    this.card = card;
    this.pageTitle = card.name;
    this.isLoading = false
  }

  private handleParamsError(error: any): Observable<never> {
    console.error('Error fetching collection data:', error);
    return EMPTY;
  }

  private handleCollectionError(error: any): Observable<never> {
    console.error('Error fetching card data:', error);
    return EMPTY;
  }

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

