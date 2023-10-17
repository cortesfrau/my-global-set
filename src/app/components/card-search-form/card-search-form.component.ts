import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Print } from 'src/app/models/print.interface';

import { Observable } from 'rxjs';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { Card } from 'src/app/models/card.interface';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})

export class CardSearchFormComponent implements OnInit {

  card: Card = {
    oracle_id: '',
    name: '',
    prints: []
  };

  cardForm = new FormGroup({
    cardName: new FormControl(''),
  });

  constructor(private scryfallService: scryfallService) {}

  ngOnInit(): void {}

  // onSubmit() {
  //   const cardNameControl = this.cardForm.get('cardName');
  //   if (cardNameControl && cardNameControl.value) {
  //     const cardName = cardNameControl.value;
  //     this.scryfallService.getCardOracleIdByName(cardName).pipe(
  //       switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id)),
  //       switchMap(data => this.scryfallService.addExtraInfoToPrints(data.prints))
  //     ).subscribe((printsWithExtraInfo) => {
  //       this.card.prints = printsWithExtraInfo;
  //     });
  //   }
  // }


  onSubmit() {
    const cardNameControl = this.cardForm.get('cardName');
    if (cardNameControl && cardNameControl.value) {
      const cardName = cardNameControl.value;
      this.scryfallService.getCardOracleIdByName(cardName).pipe(
        switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id))
      ).subscribe((card) => {
        this.card = card;

        // Show card data in console
        console.log(this.card);
      });
    }
  }






}
