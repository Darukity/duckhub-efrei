import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passKey = 'password', confirmKey = 'confirmPassword'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(passKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (pass && confirm && pass !== confirm) {
      group.get(confirmKey)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };
}