import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})

export class RequestResetComponent {

  // Password reset form
  passwordResetForm: FormGroup;

  // Flag to check if the search form was submitted.
  submitted = false;

  // User friendly messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private Auth: AuthService,
  ) {

    // Initialize the form group with form controls.
    this.passwordResetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.passwordResetForm.controls;
  }

  private handleResponse(response: any) {
    this.f['email'].setValue(null);
    this.f['email'].markAsPristine();
    this.successMessage = response.data;
    console.log(response);
  }

  onSubmit(): void {

    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.passwordResetForm.valid) {
      this.Auth.sendPasswordResetLink(this.passwordResetForm.value).subscribe({
        next: (data) => {
          this.handleResponse(data);
          console.log('Email sent!');
        },
        error: (error) => {
        this.errorMessage = error.error.error;
        console.error('Error sending the email', error);
        },
      });
    }
  }


}
