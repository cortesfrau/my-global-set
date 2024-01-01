// collection-item.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ScryfallService } from 'src/app/services/scryfall.service';
import { Collection } from 'src/app/models/collection.interface';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: [
    './collection-item.component.scss',
  ]
})
export class CollectionItemComponent implements OnInit {

  @Input() collection!: Collection;

  cardArtUrl: string | undefined;

  constructor(
    private scryfallService: ScryfallService,
    private collectionService: CollectionService
    ) {}

  ngOnInit(): void {
    this.loadCardArt();
  }

  private loadCardArt(): void {
    this.scryfallService.getCardByOracleId(this.collection.card_id).subscribe({
      next: (card) => {
        if (card && card.prints && card.prints.length > 0) {
          this.cardArtUrl = card.art_uri;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public confirmDelete(): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this collection?');
    if (isConfirmed) {
      this.deleteCollection();
    }
  }

  public deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


}
