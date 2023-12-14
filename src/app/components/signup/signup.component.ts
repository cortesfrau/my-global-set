import { Component } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  // Signup Form
  signupForm: FormGroup;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private Auth: AuthService,
    private Token: TokenService,
    private Router: Router,
    private AuthState: AuthStateService
  ) {

  this.signupForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchingValidator });
}

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  private handleResponse(data: { access_token: string; }) {
    this.successMessage = 'Your account has been created.';
    this.Token.handle(data.access_token);
    this.AuthState.changeAuthStatus(true);
    setTimeout(() => {
      this.Router.navigateByUrl('/profile');
    }, 2000);
  }

  onSubmit(): void {

    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.signupForm.valid) {

      this.Auth.signup(this.signupForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
          console.log('Sign Up successful');
        },
        error: (error: { message: string | null; }) => {
          this.errorMessage = error.message;
          console.error('Error creating account.:', error);
        },
      });

    }
  }

}
