import { ValidatorFn } from '@angular/forms';
import { PossWebFieldValidators } from '@poss-web/shared/util-field-validators';

export interface ValidationOptions {
  validators?: ValidatorFn[];
  customValidators?: CustomValidatorsOptions[];
  inputConstraint?: string;
  dateTimeValidators?: { minDate?: string; maxDate?: string };
}

export interface CustomValidatorsOptions {
  name: PossWebFieldValidators;
  options: { fieldKey: string; params?: Map<string, string> };
}
