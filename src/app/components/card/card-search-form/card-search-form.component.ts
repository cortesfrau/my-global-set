import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ScryfallService } from 'src/app/services/scryfall.service';
import { Card } from 'src/app/models/card.interface';
import { Observable, of, switchMap } from 'rxjs';

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

  // User friendly error message
  errorMessage: string | null = null;

  // Dependency injection of the ScryfallService and FormBuilder.
  constructor(
    private scryfallService: ScryfallService,
    private formBuilder: FormBuilder
  ) {

    // Initialize the form group with form controls.
    this.cardForm = new FormGroup({
      cardName: new FormControl('', [Validators.required]),
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

  // Method to reset the form and clear the state.
  clearForm(): void {
    this.cardForm.reset(); // Resets the form values.
    this.card = {} as Card; // Resets the current card information.
    this.submitted = false; // Resets the 'submitted' state.
    this.isLoading = false; // Can reset the loading state if necessary.
    this.errorMessage = null; // Reset search errors.
    localStorage.removeItem('lastSearchedCard'); // Clears the card stored in localStorage.
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

    console.log(card);
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

    // Set the 'submitted' flag to true indicating the form has been attempted to be submitted.
    this.submitted = true;

    // Clear any existing error messages when a new form submission is attempted.
    this.errorMessage = null;

    // Check if the form is valid based on the defined Validators.
    if (this.cardForm.valid) {

      // Indicate that the application is in a loading state, which can be used to display a loader in the UI.
      this.isLoading = true;

      // Start by fetching the card's Oracle ID using the card name provided in the form.
      this.scryfallService.getCardOracleIdByName(this.f['cardName'].value)

        .pipe(

          // Use the Oracle ID to fetch the full card data.
          switchMap((oracleId: string) => this.scryfallService.getCardByOracleId(oracleId)),

          // Filter the card's prints based on the 'showDigitalPrints' flag.
          switchMap((card: Card) => this.filterDigitalPrintsIfNeeded(card)),

          // Enrich the card prints with additional information from other API endpoints.
          switchMap((card: Card) => this.scryfallService.addExtraInfoToPrints(card))
        )
        .subscribe({

          // Handle the successful response by updating the UI with the card data.
          next: (card: Card) => {
            this.handleCardData(card);

            // Loading is complete, so set the loading state to false.
            this.isLoading = false;
          },

          // Handle any errors that occur during the API call sequence.
          error: (error) => {
            // On error, set loading to false and show the error message.
            this.isLoading = false;
            this.errorMessage = error.error.details;
            console.error('Error fetching card data:', error);
          },

          // Once the observable completes, ensure that the loading indicator is turned off.
          complete: () => {
            this.isLoading = false;
          }
        });

    } else {

      // If the form is not valid, set an appropriate error message to display in the UI.
      this.errorMessage = 'Please ensure the form is filled out correctly.';
    }
  }


}

