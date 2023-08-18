import { SelectOption } from '../SelectOption';
import { ValidatorFn } from '@angular/forms';

export interface BaseElementParams {
  formId?: number;
  label?: string;
  value?: string | string[];
  fieldName?: string;
  classNames?: string[]; // Avi
  selectOptions?: { value: string | string[]; selectOptions: SelectOption[] };
  dependsOn?: string;
  validators?: ValidatorFn[];
  dateTimeValidators?: { minDate?: string; maxDate?: string };
  subForm?: string[];
  show?: string[];
  min?: boolean | string;
  validationErrorMessages?: { errorType: string; errorMessage: string }[];
}
