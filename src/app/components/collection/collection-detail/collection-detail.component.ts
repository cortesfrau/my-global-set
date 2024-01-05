import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Card } from 'src/app/models/card.interface';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
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
  isLoading: boolean = true;

  private collectionUpdatedSubject = new Subject<void>();
  collectionUpdated$ = this.collectionUpdatedSubject.asObservable();

  constructor(
    private collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    private scryvelService: ScryvelService,
    private cdr: ChangeDetectorRef
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
    return this.collectionService.getCollectionContent(collection.id);
  }

  private handleCard(card: Card): void {
    this.card = card;
    this.pageTitle = card.name;
    this.isLoading = false;
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

    this.collectionService.addPrintToCollection(data).subscribe({
      next: (response) => {
        this.collectionService.getCollectionContent(this.collection.id).subscribe(
          updatedCard => {
            this.handleCard(updatedCard);
            this.collectionUpdatedSubject.next();
            this.cdr.detectChanges();
          },
          error => {
            console.error('Error refreshing data:', error);
          }
        );
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  removePrintFromCollection(print: Print): void {
    const data = {
      scryfall_id: print.id,
      collection_id: this.collection.id,
    };

    this.collectionService.removePrintFromCollection(data).subscribe({
      next: (response) => {
        this.collectionService.getCollectionContent(this.collection.id).subscribe(
          updatedCard => {
            this.handleCard(updatedCard);
            this.collectionUpdatedSubject.next();
            this.cdr.detectChanges();
          },
          error => {
            console.error('Error refreshing data:', error);
          }
        );
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
