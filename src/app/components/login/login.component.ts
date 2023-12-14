import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Login form
  loginForm: FormGroup;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly error message
  errorMessage: string | null = null;

  constructor(
    private Auth: AuthService,
    private Token: TokenService,
    private Router: Router,
    private AuthState: AuthStateService
  ) {

    // Initialize the form group with form controls.
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  private handleResponse(data: { access_token: string; }) {
    this.Token.handle(data.access_token);
    this.AuthState.changeAuthStatus(true);
    this.Router.navigateByUrl('/profile');
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.Auth.login(this.loginForm.value).subscribe({

        next: (data) => {
          this.handleResponse(data);
          console.log('User is logged in');
        },

        error: (error) => {
          this.errorMessage = error.error.error;

          console.error('Error: the user couldn\'t log in.', error);
        },

      });
    }

  }
}
