import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Card } from 'src/app/models/card.interface';
import { catchError, switchMap, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})

export class CardSearchFormComponent implements OnInit, OnDestroy {

  cardForm: FormGroup = new FormGroup({
    cardName: new FormControl(''),
  });

  card!: Card;

  submitted = false;

  isLoading: boolean = false;

  showDigitalPrints: boolean = false;

  constructor(
    private scryfallService: scryfallService,
    private formBuilder: FormBuilder
  ) {}

  ngOnDestroy() {

    // On component destroy save the last searched card into local storage
    if (this.card) {
      localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
    }
  }

  ngOnInit(): void {

    this.cardForm = this.formBuilder.group({
      cardName: ['', Validators.required]
    });

    // Try to load last searched card from local storage
    const lastSearchedCard = localStorage.getItem('lastSearchedCard');
    if (lastSearchedCard) {
      this.card = JSON.parse(lastSearchedCard);

      // Fill the form input with the last searched card name
      this.f['cardName']?.setValue(this.card.name);
    }
  }

  // Form getter
  get f(): { [key: string]: AbstractControl } {
    return this.cardForm.controls;
  }

  // Toggle the show digital prints property
  toggleShowDigitalPrints() {
    this.showDigitalPrints = !this.showDigitalPrints;
  }

  // Search card by name. Useful to search cards by link.
  searchCardByName(cardName: string): void {
    this.f['cardName'].setValue(cardName);
    this.onSubmit();
  }

  onSubmit() {
    this.submitted = true;

    // Check if form is valid
    if (this.cardForm.valid) {
      this.isLoading = true;
      const cardNameControl = this.cardForm.get('cardName');
      if (cardNameControl && cardNameControl.value) {
        const cardName = cardNameControl.value;
        this.scryfallService.getCardOracleIdByName(cardName).pipe(
          switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id))
        ).subscribe((card) => {

          // Apply filter based on showDigitalPrints
          if (!this.showDigitalPrints) {
            card.prints = card.prints.filter((print) => !print.digital);
          }

          this.scryfallService.addExtraInfoToPrints(card).subscribe((updatedCard) => {
            this.card = updatedCard;

            // Show card info on console
            console.log(this.card);

            timer(250).subscribe(() => {
              this.isLoading = false;
            });

            // Save last searched card into local storage and update input value
            if (this.card) {
              localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
              this.f['cardName']?.setValue(this.card.name);
            }
          });
        });
      }
    }
  }




}
