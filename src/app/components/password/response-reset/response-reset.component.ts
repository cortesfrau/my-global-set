import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent {

  // Reset Password Form
  resetPasswordForm!: FormGroup;

  // Reset Token
  // resetToken!: string;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly error message
  errorMessage: string | null = null;

  constructor(
    private Route: ActivatedRoute,
    private Auth: AuthService
  ) {

    this.Route.queryParams.subscribe(params => {
      // this.resetToken = params['token'];
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

  private handleResponse(res: any) {
    console.log(res);
  }

  onSubmit(): void {
    this.submitted = true;

    // Clear any existing error messages when a new form submission is attempted.
    this.errorMessage = null;

    if (this.resetPasswordForm.valid) {

      console.log(this.resetPasswordForm.value);

      this.Auth.changePassword(this.resetPasswordForm.value).subscribe({
        next: (data: any) => {
          this.handleResponse(data);
          console.log('Password changed.');

          console.log(this.resetPasswordForm.value);
        },
        error: (error: { message: string | null; }) => {
          this.errorMessage = error.message;
          console.error('Error changing the password:', error);
        },
      });


    }
  }
}
