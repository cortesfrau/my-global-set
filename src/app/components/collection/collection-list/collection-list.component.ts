import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { UserService } from 'src/app/services/user.service';
import { Collection } from 'src/app/models/collection.interface';

/**
 * Component for displaying a list of user collections.
 */
@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {

  /** Array containing user collections. */
  collections: Collection[] = [];

  /** Error message for displaying any encountered issues. */
  errorMessage: string = '';

  /** Title of the page. */
  pageTitle: string = 'Collections';

  /** Flag indicating if there is a current API call in progress. */
  isLoading: boolean = true;

  // Sort collections
  sortCriteria: string = 'card_name';
  sortOrder: 'asc' | 'desc' = 'asc';

  /**
   * Constructor for the CollectionListComponent.
   * @param collectionService - Service for handling collection-related operations.
   * @param userService - Service for handling user-related operations.
   */
  constructor(
    private collectionService: CollectionService,
    private userService: UserService,
  ) {}

  /**
   * Maps raw collection data to the Collection interface.
   * @param collectionData - Raw collection data from the server.
   * @returns An array of Collection objects.
   */
  private mapToCollections(collectionData: any[]): Collection[] {
    return collectionData.map((collection) => {
      const mappedCollection: Collection = {
        id: collection.id,
        user_id: collection.user_id,
        card_name: collection.card_name,
        card_id: collection.card_id,
        is_completed: false
      };

      // Call getCollectionStats and update is_completed if completed_percentage is 100
      this.collectionService.getCollectionStats(collection.id).subscribe({
        next: (stats) => {
          mappedCollection.is_completed = stats.completed_percentage === 100;
        },
        error: (error) => {
          console.error('Error fetching collection stats:', error);
        }
      });

      return mappedCollection;
    });
  }

  /**
   * Lifecycle hook called after the component is initialized.
   * Retrieves the authenticated user's collections.
   */
  ngOnInit(): void {
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.collectionService.getUserCollections(user.id).subscribe({
            next: (collectionData) => {
              this.collections = this.mapToCollections(collectionData.collections);
              this.sortCollections();
              this.isLoading = false;

            },
            error: (error) => {
              this.errorMessage = error.error.error;
              console.error(error);
              this.isLoading = false;
            }
          });
        }
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  /**
   * Handles the event when a collection is deleted.
   * @param deletedCollection - The collection that was deleted.
   */
  onCollectionDeleted(deletedCollection: Collection): void {
    this.collections = this.collections.filter(collection => collection.id !== deletedCollection.id);
  }

  /**
   * Changes the sorting criteria and updates the order of collections accordingly.
   * @param criteria - The sorting criteria to apply.
   */
  changeSortCriteria(criteria: string): void {
    this.sortCriteria = criteria;
    this.sortCollections();
  }

  /**
   * Changes the sorting order and updates the order of collections accordingly.
   * @param order - The sorting order to apply ('asc' or 'desc').
   */
  changeSortOrder(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.sortCollections();
  }

  /**
   * Sorts the collections based on the selected criteria and order.
   */
  sortCollections(): void {
    this.collections.sort((a, b) => {
      const valueA = this.getSortValue(a);
      const valueB = this.getSortValue(b);
      if (this.sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  /**
   * Gets the sorting value for a collection based on the selected criteria.
   * @param collection - The collection to retrieve the sorting value for.
   * @returns The sorting value for the collection.
   */
  getSortValue(collection: Collection): string {
    switch (this.sortCriteria) {
      case 'card_name':
        return collection.card_name;
      case 'completed':
        return collection.is_completed ? '1' : '0';
      default:
        return '';
    }
  }
}
