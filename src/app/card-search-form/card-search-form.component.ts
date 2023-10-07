import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})
export class CardSearchFormComponent {

  cardForm= new FormGroup({
    cardName: new FormControl(''),
  });

  onSubmit() {
    console.warn(this.cardForm.value);
  }

}
