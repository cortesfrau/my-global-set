import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Component for handling user password reset requests.
 */
@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent {

  // Password reset form
  passwordResetForm: FormGroup;

  // User-friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Form Spinner
  showSpinner = false;

  /**
   * Constructor for the RequestResetComponent.
   * @param authService - Authentication service for handling password reset requests.
   */
  constructor(
    private authService: AuthService,
  ) {
    // Initialize the form group with form controls.
    this.passwordResetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**
   * Getter for form controls to facilitate access to form fields.
   * @returns Object with form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.passwordResetForm.controls;
  }

  /**
   * Handles the response after a successful password reset request.
   * @param response - Data containing the success message.
   */
  private handleResponse(response: any): void {
    // Clear and mark the email control as pristine after a successful request.
    this.f['email'].setValue(null);
    this.f['email'].markAsPristine();
    this.successMessage = response.data;
    console.log(response);
  }

  /**
   * Handles form submission for user password reset request.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showSpinner = true;

    if (this.passwordResetForm.valid) {
      this.authService.sendPasswordResetLink(this.passwordResetForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
          console.log('Email sent!');
        },
        error: (error) => {
          this.showSpinner = false;
          this.errorMessage = error.error.error;
          console.error('Error sending the email', error);
        },
        complete: () => {
          this.showSpinner = false;
        },
      });
    }
  }
}
