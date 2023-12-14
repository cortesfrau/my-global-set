import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { passwordMatchingValidator } from 'src/shared/validators/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    // Profile Form
    profileForm: FormGroup;

    // Flag to check if the search form was submitted.
    submitted: boolean = false;

    // User friendly messages
    errorMessage: string | null = null;
    successMessage: string | null = null;

    constructor(
      private User: UserService
    ) {

    this.profileForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', ),
      password_confirmation: new FormControl('', ),
      id: new FormControl(''),
    }, { validators: passwordMatchingValidator });
  }

  // Getter for form controls to facilitate access to form fields.
  get f(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    this.User.getAuthenticated().subscribe({
      next: (data) => {
        this.profileForm.controls['first_name'].setValue(data.first_name);
        this.profileForm.controls['last_name'].setValue(data.last_name);
        this.profileForm.controls['email'].setValue(data.email);
        this.profileForm.controls['id'].setValue(data.id);
      },
      error: (error: { message: string | null; }) => {
        console.error('Error retrieving user info:', error);
      },
    });
  }

  private handleSubmitResponse(response: any) {
    console.log(response);
    this.successMessage = 'Profile updated.'
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.profileForm.valid) {

      this.User.update(this.profileForm.value).subscribe({
        next: (data: any) => {
          this.handleSubmitResponse(data);
        },
        error: (error: any) => {
          this.errorMessage = error.error.error;
          console.error('Error updating the user:', error);
        },
      });

    }
  }

}
