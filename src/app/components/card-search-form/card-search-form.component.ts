import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';


@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})
export class CardSearchFormComponent {

  constructor(private scryfallService: scryfallService) { }

  cardForm = new FormGroup({
    cardName: new FormControl(''),
  });

  onSubmit() {
    const cardForm = this.cardForm;
    if (cardForm) {
      const cardNameControl = cardForm.get('cardName');
      if (cardNameControl) {
        const cardName = cardNameControl.value;
        if (cardName) {
          this.scryfallService.getCardByName(cardName).subscribe((data) => {
            console.log(data.oracle_id);
            this.scryfallService.getCardVersionsByOracleId(data.oracle_id).subscribe((data) => {
              console.log(data);
            })
          });
        }
      }
    }
  }



}
