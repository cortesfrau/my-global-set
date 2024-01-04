import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

/**
 * Component for handling user login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Login form
  loginForm: FormGroup;

  // User-friendly error message
  errorMessage: string | null = null;

  // Show Spinner
  showSpinner = false;

  /**
   * Constructor for the LoginComponent.
   * @param authService - Authentication service for handling login.
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
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Getter for form controls to facilitate access to form fields.
   * @returns Object with form controls.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /**
   * Handles the response after a successful login.
   * @param data - Data containing the access token.
   */
  private handleResponse(data: { access_token: string; }): void {
    this.tokenService.handle(data.access_token);
    this.authStateService.changeAuthStatus(true);
    this.router.navigateByUrl('/');
  }

  /**
   * Handles form submission for user login.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.showSpinner = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
        },
        error: (error) => {
          this.showSpinner = false;
          this.errorMessage = error.error.error;
          console.error(error);
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
    }
  }
}
