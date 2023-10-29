import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Card } from 'src/app/models/card.interface';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})

export class CardSearchFormComponent implements OnInit, OnDestroy {

  card!: Card;

  cardForm = new FormGroup({
    cardName: new FormControl(''),
  });

  isLoading: boolean = false;

  constructor(private scryfallService: scryfallService) {}


  ngOnDestroy() {
    // Al destruir el componente, guardamos la última carta buscada en localStorage
    if (this.card) {
      localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
    }
  }

  ngOnInit(): void {
    // Al inicializar el componente, intentamos cargar la última carta buscada desde localStorage
    const lastSearchedCard = localStorage.getItem('lastSearchedCard');
    if (lastSearchedCard) {
      this.card = JSON.parse(lastSearchedCard);
      // Rellenar el campo del formulario con el nombre de la última carta
      this.cardForm.get('cardName')?.setValue(this.card.name);
    }
  }

  onSubmit() {
    this.isLoading = true;
    const cardNameControl = this.cardForm.get('cardName');
    if (cardNameControl && cardNameControl.value) {
      const cardName = cardNameControl.value;
      this.scryfallService.getCardOracleIdByName(cardName).pipe(
        switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id))
      ).subscribe((card) => {
        this.scryfallService.addExtraInfoToPrints(card).subscribe((updatedCard) => {
          this.card = updatedCard;
          console.log(this.card);

          timer(1000).subscribe(() => {
            this.isLoading = false;
          });

          // Guardar la última carta buscada en localStorage al completar la búsqueda
          if (this.card) {
            localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
          }
        });
      });
    }
  }

}
