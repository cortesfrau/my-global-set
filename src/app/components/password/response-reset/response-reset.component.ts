import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';
import { Router } from '@angular/router';

/**
 * Component for handling user response to a password reset request.
 */
@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent {

  // Reset Password Form
  resetPasswordForm!: FormGroup;

  // User-friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Form Spinner
  showSpinner = false;

  /**
   * Constructor for the ResponseResetComponent.
   * @param route - Activated route to access query parameters.
   * @param auth - Authentication service for handling password reset responses.
   * @param router - Angular router for navigation.
   */
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
  ) {
    // Subscribe to query parameters and initialize the form with the received parameters.
    this.route.queryParams.subscribe(params => {
      this.resetPasswordForm = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        password_confirmation: new FormControl('', [Validators.required]),
        reset_token: new FormControl(params['token']),
        email: new FormControl(params['email'])
      }, { validators: passwordMatchingValidator });
    });
  }

  /**
   * Getter for form controls to facilitate access to form fields.
   * @returns Object with form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }

  /**
   * Handles the response after a successful password reset.
   * @param response - Data containing the success message.
   */
  private handleResponse(response: any): void {
    this.successMessage = response.data;
    // Navigate to the login page after a delay of 2000 milliseconds (2 seconds).
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

  /**
   * Handles form submission for user password reset.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showSpinner = true;

    if (this.resetPasswordForm.valid) {
      this.auth.changePassword(this.resetPasswordForm.value).subscribe({
        next: (data: any) => {
          this.handleResponse(data);
        },
        error: (error: any) => {
          this.showSpinner = false;
          this.errorMessage = error.error.error;
          console.error('Error changing the password:', error);
        },
        complete: () => {
          this.showSpinner = false;
        },
      });
    }
  }
}
