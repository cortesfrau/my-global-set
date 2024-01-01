// collection-item.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ScryfallService } from 'src/app/services/scryfall.service';
import { Collection } from 'src/app/models/collection.interface';

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

  constructor(private scryfallService: ScryfallService) {}

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
}
