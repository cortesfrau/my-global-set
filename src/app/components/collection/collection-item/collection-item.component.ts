// collection-item.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() collectionDeleted = new EventEmitter<Collection>();

  cardArtUrl: string | undefined;
  isDeleting: boolean = false;

  collectionStats: any;

  constructor(
    private scryfallService: ScryfallService,
    private collectionService: CollectionService
    ) {}

  ngOnInit(): void {
    this.loadCardArt();
    this.getCollectionStats();
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
      this.isDeleting = true;
      this.deleteCollection()
    }
  }

  public deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe({
      next: () => {
        this.collectionDeleted.emit(this.collection);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public getCollectionStats(): void {
    this.collectionService.getCollectionStats(this.collection.id).subscribe({
      next: (response) => {
        this.collectionStats = response;
      },
      error: (error) => {
        console.error(error);
      },
    })
  }

}
