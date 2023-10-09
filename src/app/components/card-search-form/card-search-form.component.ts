import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Print } from 'src/app/models/print.interface';
@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})
export class CardSearchFormComponent {
  prints: Print[] = [];

  constructor(private scryfallService: scryfallService) {}

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
          this.scryfallService.getCardOracleIdByName(cardName).subscribe((oracle_id) => {
            this.scryfallService.getCardByOracleId(oracle_id).subscribe((data) => {

              // Llama al método para agregar información extra a los prints
              this.scryfallService.addExtraInfoToPrints(data.prints).subscribe((printsWithExtraInfo) => {

                // Asigna los prints con información extra a la variable 'prints'
                this.prints = printsWithExtraInfo;
                console.log(printsWithExtraInfo);
                console.log(this.prints);
              });
            });
          });
        }
      }
    }
  }




}
