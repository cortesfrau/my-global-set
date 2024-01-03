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

  isLoading: boolean = true;


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
      return collectionData.map((collection) => ({
        id: collection.id,
        user_id: collection.user_id,
        card_name: collection.card_name,
        card_id: collection.card_id,
      }));
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

  onCollectionDeleted(deletedCollection: Collection): void {
    this.collections = this.collections.filter(collection => collection.id !== deletedCollection.id);
  }

}
