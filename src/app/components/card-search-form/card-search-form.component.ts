import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Card } from 'src/app/models/card.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})

export class CardSearchFormComponent implements OnInit {

  card!: Card;

  cardForm = new FormGroup({
    cardName: new FormControl(''),
  });

  constructor(private scryfallService: scryfallService) {}

  ngOnInit(): void {}

  onSubmit() {
    const cardNameControl = this.cardForm.get('cardName');
    if (cardNameControl && cardNameControl.value) {
      const cardName = cardNameControl.value;
      this.scryfallService.getCardOracleIdByName(cardName).pipe(
        switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id))
      ).subscribe((card) => {
        this.scryfallService.addExtraInfoToPrints(card).subscribe((updatedCard) => {
          this.card = updatedCard;
          console.log(this.card);
        });
      });
    }
  }

}
