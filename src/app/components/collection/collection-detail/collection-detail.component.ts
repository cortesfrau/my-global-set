import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Card } from 'src/app/models/card.interface';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
import { Print } from 'src/app/models/print.interface';
import { collectionStats } from 'src/app/models/collection-stats';

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
  collection_stats: collectionStats = {
    collected_prints_count: 0,
    total_prints_count: 0,
    completed_percentage: 0
  }

  private collectionUpdatedSubject = new Subject<void>();
  collectionUpdated$ = this.collectionUpdatedSubject.asObservable();

  // Loading state for each print
  public printLoadingStates: { [key: string]: boolean } = {};

  constructor(
    private collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
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
      card => {
        this.handleCard(card);
        this.getCollectionStats()
      }
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
    this.printLoadingStates[print.id] = true;

    const data = {
      scryfall_id: print.id,
      collection_id: this.collection.id,
    };

    this.collectionService.addPrintToCollection(data).subscribe({
      next: (response) => {
        this.collectionService.getCollectionContent(this.collection.id).subscribe({
          next: (response) => {
            this.handleCard(response);
            this.updateCollectionStats();
            this.collectionUpdatedSubject.next();
            this.cdr.detectChanges();
            this.printLoadingStates[print.id] = false;
          },
          error: (error) => {
            console.error('Error:', error);
            this.printLoadingStates[print.id] = false;
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.printLoadingStates[print.id] = false;
      }
    });
  }

  removePrintFromCollection(print: Print): void {
    this.printLoadingStates[print.id] = true;

    const data = {
      scryfall_id: print.id,
      collection_id: this.collection.id,
    };

    this.collectionService.removePrintFromCollection(data).subscribe({
      next: (response) => {
        this.collectionService.getCollectionContent(this.collection.id).subscribe({
          next: (response) => {
            this.handleCard(response);
            this.updateCollectionStats();
            this.collectionUpdatedSubject.next();
            this.cdr.detectChanges();
            this.printLoadingStates[print.id] = false;
          },
          error: (error) => {
            console.error('Error:', error);
            this.printLoadingStates[print.id] = false;
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.printLoadingStates[print.id] = false;
      }
    });
  }

  private getCollectionStats(): void {
    this.collectionService.getCollectionStats(this.collection.id).subscribe({
      next: (stats) => {
        this.collection_stats = stats;
      },
      error: (error) => {
        console.error('Error fetching collection stats:', error);
      }
    });
  }

  private updateCollectionStats(): void {
    this.collectionService.getCollectionStats(this.collection.id).subscribe({
      next: (stats) => {
        this.collection_stats = stats;
        this.collectionUpdatedSubject.next();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching collection stats:', error);
      }
    });
  }


}
