import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export const passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirmation = control.get('password_confirmation');
  return password && passwordConfirmation && password.value === passwordConfirmation.value ? null : { passwordsDontMatch: true };
};
