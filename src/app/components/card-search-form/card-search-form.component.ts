import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { scryfallService } from 'src/app/services/scryfall.service';
import { Card } from 'src/app/models/card.interface';
import { Observable, catchError, of, switchMap, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-card-search-form',
  templateUrl: './card-search-form.component.html',
  styleUrls: ['./card-search-form.component.scss']
})
export class CardSearchFormComponent implements OnInit, OnDestroy {

  // FormGroup instance to manage the form controls for card search.
  cardForm: FormGroup;

  // The card instance to store the data fetched from the API.
  card!: Card;

  // Flag to check if the search form was submitted.
  submitted = false;

  // Flag to represent the loading state during API call.
  isLoading: boolean = false;

  // Flag to decide whether to show digital prints in the results.
  showDigitalPrints: boolean = false;

  // Dependency injection of the ScryfallService and FormBuilder.
  constructor(
    private scryfallService: scryfallService,
    private formBuilder: FormBuilder
  ) {
    // Initialize the form group with the form controls.
    this.cardForm = this.formBuilder.group({
      cardName: ['', Validators.required] // cardName field must be non-empty.
    });
  }

  // Actions to perform when the component is destroyed.
  ngOnDestroy(): void {
    // Persist the last searched card data into local storage.
    if (this.card) {
      localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
    }
  }

  // Lifecycle hook for initialization tasks.
  ngOnInit(): void {
    // Attempt to retrieve and populate the form with the last searched card from local storage.
    const lastSearchedCard = localStorage.getItem('lastSearchedCard');
    if (lastSearchedCard) {
      this.card = JSON.parse(lastSearchedCard);
      this.cardForm.patchValue({ cardName: this.card.name });
    }
  }

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.cardForm.controls;
  }

  // Toggle the state of digital print display.
  toggleShowDigitalPrints(): void {
    this.showDigitalPrints = !this.showDigitalPrints;
  }

  // Initiates a card search by name.
  searchCardByName(cardName: string): void {
    this.cardForm.patchValue({ cardName });
    this.onSubmit();
  }

  // Fetch card data by name from the Scryfall API.
  private fetchCardByName(cardName: string): Observable<Card> {
    return this.scryfallService.getCardOracleIdByName(cardName).pipe(
      switchMap(oracle_id => this.scryfallService.getCardByOracleId(oracle_id))
    );
  }

  // Filters out digital prints from the card's print array if needed.
  private filterDigitalPrintsIfNeeded(card: Card): Observable<Card> {
    return of(this.showDigitalPrints ? card : { ...card, prints: card.prints.filter(print => !print.digital) });
  }

  // Handles the card data received from the API and updates the view.
  private handleCardData(card: Card): void {
    this.card = card;
    // Optionally, additional operations on the card data can be done here.
    this.saveLastSearchedCard();
    this.updateFormValue();
  }

  // Persists the last searched card into local storage.
  private saveLastSearchedCard(): void {
    localStorage.setItem('lastSearchedCard', JSON.stringify(this.card));
  }

  // Updates the form's cardName field with the latest card's name.
  private updateFormValue(): void {
    this.f['cardName'].setValue(this.card.name);
  }

  // Event handler for form submission.
  onSubmit(): void {
    this.submitted = true;
    if (this.cardForm.valid) {
      this.isLoading = true;
      this.fetchCardByName(this.f['cardName'].value)
        .pipe(
          catchError(err => {
            // Log and handle errors appropriately.
            console.error(err);
            return throwError(() => new Error('Failed to fetch card data'));
          }),
          switchMap(card => this.filterDigitalPrintsIfNeeded(card)),
          switchMap(card => this.scryfallService.addExtraInfoToPrints(card))
        )
        .subscribe({
          next: (card) => this.handleCardData(card),
          error: (error) => {
            // Error handling logic, such as displaying a message to the user.
            this.isLoading = false;
            // ...
          },
          complete: () => this.isLoading = false // Clean up actions after subscription.
        });
    }
  }
}
