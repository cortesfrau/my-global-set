import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Card } from 'src/app/models/card.interface';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
import { Print } from 'src/app/models/print.interface';
import { collectionStats } from 'src/app/models/collection-stats';

/**
 * Component for displaying detailed information about a collection.
 */
@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {

  // Properties to hold collection details and loading states
  collection!: Collection;
  collectionId!: number;
  card!: Card;
  pageTitle: string = '';
  collection_stats: collectionStats = {
    collected_prints_count: 0,
    total_prints_count: 0,
    completed_percentage: 0
  }

  // Subject to notify observers when the collection is updated
  private collectionUpdatedSubject = new Subject<void>();
  collectionUpdated$ = this.collectionUpdatedSubject.asObservable();

  // Loading state for each print
  public printLoadingStates: { [key: string]: boolean } = {};

  // State to track whether the page is fully loaded
  pageLoaded: boolean = false;

  constructor(
    private collectionService: CollectionService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle hook called after Angular has initialized all data-bound properties.
   * Initiates the component by fetching and handling collection data.
   */
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => this.handleParams(params)),
      catchError(error => this.handleParamsError(error)),
      switchMap(collection => this.handleCollection(collection)),
      catchError(error => this.handleCollectionError(error)),
    ).subscribe(
      card => {
        this.handleCard(card);
        this.getCollectionStats();
        // Mark the page as loaded when all operations are completed
        this.pageLoaded = true;
      }
    );
  }

  /**
   * Handles route parameters to extract the collection ID.
   * @param params - Route parameters containing the collection ID.
   * @returns Observable that emits the collection with the specified ID.
   */
  private handleParams(params: ParamMap): Observable<Collection> {
    const idParam = params.get('id');
    if (idParam !== null) {
      this.collectionId = +idParam;
    }
    return this.collectionService.getCollection(this.collectionId);
  }

  /**
   * Handles the retrieved collection by fetching its content.
   * @param collection - The collection to handle.
   * @returns Observable that emits the card associated with the collection.
   */
  private handleCollection(collection: Collection): Observable<Card> {
    this.collection = collection;
    return this.collectionService.getCollectionContent(collection.id);
  }

  /**
   * Handles the retrieved card information and sets component properties accordingly.
   * @param card - The card associated with the collection.
   */
  private handleCard(card: Card): void {
    this.card = card;
    this.pageTitle = card.name;
  }

  /**
   * Handles errors related to route parameters.
   * @param error - The error that occurred.
   * @returns An observable that never emits, preventing further subscription.
   */
  private handleParamsError(error: any): Observable<never> {
    console.error('Error fetching collection data:', error);
    return EMPTY;
  }

  /**
   * Handles errors related to fetching collection data.
   * @param error - The error that occurred.
   * @returns An observable that never emits, preventing further subscription.
   */
  private handleCollectionError(error: any): Observable<never> {
    console.error('Error fetching card data:', error);
    return EMPTY;
  }

  /**
   * Adds a print to the collection and updates the component state accordingly.
   * @param print - The print to add to the collection.
   */
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

  /**
   * Removes a print from the collection and updates the component state accordingly.
   * @param print - The print to remove from the collection.
   */
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

  /**
   * Fetches and updates collection statistics.
   */
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

  /**
   * Updates collection statistics and notifies observers about the update.
   */
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

  /**
   * Checks if all required elements are loaded.
   * Additional conditions can be added if necessary.
   * @returns True if all elements are loaded, otherwise false.
   */
  areAllElementsLoaded(): boolean {
    return this.card !== undefined && this.collection_stats !== undefined;
  }

  /**
   * Checks if the page is fully loaded.
   * @returns True if the page is fully loaded, otherwise false.
   */
  isPageLoaded(): boolean {
    return this.pageLoaded && this.areAllElementsLoaded();
  }

}
