import { Component } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
[x: string]: any;

  // Signup form
  signupForm: FormGroup;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly error message
  errorMessage: string | null = null;

  constructor(
    private Auth: AuthService,
    private Token: TokenService,
    private Router: Router
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
    this.Token.handle(data.access_token);
    this.Router.navigateByUrl('/profile');
  }

  onSubmit(): void {
    this.submitted = true;

    // Clear any existing error messages when a new form submission is attempted.
    this.errorMessage = null;

    if (this.signupForm.valid) {

      console.log(this.signupForm);

      this.Auth.signup(this.signupForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
          console.log('Sign Up successful');
        },
        error: (error: { message: string | null; }) => {
          this.errorMessage = error.message;
          console.error('Error signing up the user:', error);
        },
      });
    }
  }

}
