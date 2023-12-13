import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { SnotifyModule, SnotifyService } from 'ng-alt-snotify';

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

   // User friendly error message
   errorMessage: string | null = null;

   constructor(
     private Auth: AuthService,
     private Token: TokenService,
     private Router: Router,
     private AuthState: AuthStateService,
     private Snotify: SnotifyService
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

   private handleResponse(response: JSON) {
    this.f['email'].setValue(null);
    console.log(response);
  }

   onSubmit(): void {
     this.submitted = true;
     this.errorMessage = null;

     if (this.passwordResetForm.valid) {
       this.Auth.sendPasswordResetLink(this.passwordResetForm.value).subscribe({
         next: (data) => {
           this.handleResponse(data);
           console.log('Password reset link sent!');
         },
         error: (error) => {
          this.Snotify.error(error.error.error);
          this.errorMessage = error.error.error;
          console.error('Error sending password reset link:', error);
         },
       });
     }
   }
}
