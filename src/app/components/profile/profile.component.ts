import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

/**
 * Component for handling user profile updates.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  // Profile Form
  profileForm: FormGroup;

  // User-friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Form Spinner
  showSpinner = false;

  /**
   * Constructor for the ProfileComponent.
   * @param userService - User service for handling user profile updates.
   */
  constructor(
    private userService: UserService
  ) {
    // Initialize the profile form with form controls.
    this.profileForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      password_confirmation: new FormControl(''),
      id: new FormControl(''),
    }, { validators: passwordMatchingValidator });
  }

  /**
   * Getter for form controls to facilitate access to form fields.
   * @returns Object with form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  /**
   * Lifecycle hook called after the component is initialized.
   * Retrieves the authenticated user's information and populates the profile form.
   */
  ngOnInit(): void {
    this.userService.getAuthenticated().subscribe({
      next: (data) => {
        this.profileForm.controls['first_name'].setValue(data.first_name);
        this.profileForm.controls['last_name'].setValue(data.last_name);
        this.profileForm.controls['email'].setValue(data.email);
        this.profileForm.controls['id'].setValue(data.id);
      },
      error: (error: { message: string | null; }) => {
        console.error('Error retrieving user info:', error);
      },
    });
  }

  /**
   * Handles the response after a successful profile update.
   * @param response - Data containing the success message.
   */
  private handleSubmitResponse(response: any): void {
    console.log(response);
    this.successMessage = 'Profile updated.';
  }

  /**
   * Handles form submission for user profile update.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showSpinner = true;

    if (this.profileForm.valid) {
      this.userService.update(this.profileForm.value).subscribe({
        next: (data: any) => {
          this.handleSubmitResponse(data);
        },
        error: (error: any) => {
          this.showSpinner = false;
          this.errorMessage = error.error.error;
          console.error('Error updating the user:', error);
        },
        complete: () => {
          this.showSpinner = false;
        },
      });
    }
  }

}
