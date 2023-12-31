import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { UserService } from 'src/app/services/user.service';
import { Collection } from 'src/app/models/collection.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {

  collections: Collection[] = [];

  // Page Title
  pageTitle = 'Collections';

  constructor(
    private collectionService: CollectionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.collectionService.getUserCollections(user.id).subscribe({
            next: (collectionData) => {
              this.collections = this.mapToCollections(collectionData.collections);
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private mapToCollections(collectionData: any[]): Collection[] {
    return collectionData.map((collection) => ({
      id: collection.id,
      user_id: collection.user_id,
      card_name: collection.card_name,
      card_id: collection.card_id,
    }));
  }

}
