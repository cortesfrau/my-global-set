import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent {
  [x: string]: any;

  // Reset Password Form
  resetPasswordForm!: FormGroup;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private Route: ActivatedRoute,
    private Auth: AuthService,
    private Router: Router,
  ) {

    this.Route.queryParams.subscribe(params => {
      this.resetPasswordForm = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        password_confirmation: new FormControl('', [Validators.required]),
        reset_token: new FormControl(params['token']),
        email: new FormControl(params['email'])
      }, { validators: passwordMatchingValidator });

    });

  }

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }

  private handleResponse(response: any) {
    this.successMessage = response.data;
    setTimeout(() => {
      this.Router.navigateByUrl('/login');
    }, 2000);
  }

  onSubmit(): void {

    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.resetPasswordForm.valid) {

      this.Auth.changePassword(this.resetPasswordForm.value).subscribe({
        next: (data: any) => {
          this.handleResponse(data);
        },
        error: (error: any) => {
          this.errorMessage = error.error.error;
          console.error('Error changing the password:', error);
        },
      });


    }
  }
}
