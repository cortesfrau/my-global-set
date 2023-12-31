import { Component } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

/**
 * Component for handling user signup.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  // Signup Form
  signupForm: FormGroup;

  // Form Spinner
  showSpinner = false;

  // User-friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  /**
   * Constructor for the SignupComponent.
   * @param authService - Authentication service for handling signup.
   * @param tokenService - Service for handling tokens.
   * @param router - Angular router for navigation.
   * @param authStateService - Service for managing authentication state.
   */
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private authStateService: AuthStateService
  ) {
    // Initialize the form group with form controls.
    this.signupForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl('', [Validators.required]),
    }, { validators: passwordMatchingValidator });
  }

  /**
   * Getter for form controls to facilitate access to form fields.
   * @returns Object with form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  /**
   * Handles the response after a successful signup.
   * @param data - Data containing the access token.
   */
  private handleResponse(data: { access_token: string; }): void {
    this.successMessage = 'Your account has been created.';
    this.tokenService.handle(data.access_token);
    this.authStateService.changeAuthStatus(true);
    // Redirect to profile after a delay of 2000 milliseconds (2 seconds).
    setTimeout(() => {
      this.router.navigateByUrl('/profile');
    }, 2000);
  }

  /**
   * Handles form submission for user signup.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showSpinner = true;

    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
          console.log('Sign Up successful');
        },
        error: (error) => {
          this.showSpinner = false;
          this.errorMessage = error.message || 'An error occurred.';
          console.error('Error creating account:', error);
        },
        complete: () => {
          this.showSpinner = false;
        },
      });
    }
  }

}
