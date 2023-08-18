import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Injectable()
export class HelperFunctions {
  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  patchValue(
    obj: any,
    key: string,
    selector: string,
    idVal: string,
    otherFalse?: boolean
  ) {
    if (!idVal) {
      return obj;
    }
    const objClone = obj.map(
      (a: { [x: string]: { toString: () => string } }) => {
        const returnValue = { ...a };
        if (otherFalse) {
          returnValue[selector] = false;
        }
        if (a[key].toString() === idVal.toString()) {
          returnValue[selector] = true;
        } else {
          if (idVal.toString().split(',').length) {
            idVal
              .toString()
              .split(',')
              .forEach(arrVal => {
                if (a[key].toString() === arrVal.toString()) {
                  returnValue[selector] = true;
                }
              });
          }
        }
        return returnValue;
      }
    );
    return objClone;
  }

  setValidators(
    formGroup: FormGroup,
    subForm: string,
    formField: string,
    validators: ValidatorFn[]
  ) {
    if (
      formGroup === null ||
      formGroup === undefined ||
      formField === null ||
      formField === undefined
    ) {
      throw new Error('Mandatory fields missing in setValidators');
    }
    if (subForm) {
      formGroup.get(subForm).get(formField).setValidators(validators);
    } else {
      formGroup.get(formField).setValidators(validators);
    }
  }

  setRequiredValidators(
    formGroup: FormGroup,
    subForm: string,
    formField: string,
    required: boolean
  ) {
    if (
      formGroup === null ||
      formGroup === undefined ||
      formField === null ||
      formField === undefined
    ) {
      throw new Error('Mandatory fields missing in setValidators');
    }

    if (subForm) {
      const field = <any>formGroup.get(subForm).get(formField);
      const factoryCodeValidatorWORequired = field.validators.filter(
        (val: (control: AbstractControl) => ValidationErrors) =>
          val !== Validators.required
      );

      if (required) {
        field.setValidators([
          ...factoryCodeValidatorWORequired,
          Validators.required
        ]);
      } else {
        field.setValidators(factoryCodeValidatorWORequired);
      }
      field.updateValueAndValidity();
    } else {
      const field = <any>formGroup.get(formField);
      const factoryCodeValidatorWORequired = field.validators.filter(
        (val: (control: AbstractControl) => ValidationErrors) =>
          val !== Validators.required
      );
      if (required) {
        field.setValidators([
          ...factoryCodeValidatorWORequired,
          Validators.required
        ]);
      } else {
        field.setValidators(factoryCodeValidatorWORequired);
      }
      field.updateValueAndValidity();
    }
  }

  setConditionalValidators(
    formGroup: FormGroup,
    subForm: string,
    formField: string,
    conditionalValidator: any[]
  ) {
    if (
      formGroup === null ||
      formGroup === undefined ||
      formField === null ||
      formField === undefined
    ) {
      throw new Error('Mandatory fields missing in setValidators');
    }

    if (subForm) {
      const field = <any>formGroup.get(subForm).get(formField);
      if (field) {
        field.setValidators(conditionalValidator);
        field.updateValueAndValidity();
      }
    } else {
      const field = <any>formGroup.get(formField);
      if (field) {
        field.setValidators(conditionalValidator);
        field.updateValueAndValidity();
      }
    }
  }
}
