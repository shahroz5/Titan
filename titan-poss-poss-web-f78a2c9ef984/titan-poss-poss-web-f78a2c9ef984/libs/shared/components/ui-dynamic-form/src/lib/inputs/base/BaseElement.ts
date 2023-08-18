import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { BaseElementParams } from './BaseElementParams';
import { InputControlType } from '../InputControlType';

export class BaseElement extends FormControl {
  public formId: number;
  public name: string;
  public classNames: string[];
  public label: string;
  public controlType: InputControlType;
  public validators: ValidatorFn[];
  public dateTimeValidators: { minDate?: string; maxDate?: string };
  public validationErrorMessages: { errorType: string; errorMessage: string }[];
  public fieldName: string;
  public min: boolean | string;

  constructor(
    name: string,
    inputParams: BaseElementParams,
    controlType?: InputControlType
  ) {
    let dateValValidation: string[];

    super(inputParams.value, Validators.compose(inputParams.validators));
    if (controlType === 'datetimepicker' || controlType === 'datepicker') {
      // Special date time picker parser
      dateValValidation = inputParams.value.toString().split('|');
      inputParams.value = dateValValidation[0];
      this.min = inputParams.min;
    }
    this.controlType = controlType;
    this.name = inputParams.formId + '-' + name;
    this.classNames = inputParams.classNames;
    this.formId = inputParams.formId;
    this.label = inputParams.label;
    this.validators = inputParams.validators;
    this.validationErrorMessages = inputParams.validationErrorMessages;
    this.fieldName = inputParams.fieldName;
    //  this.setValue('1');

    if (controlType === 'datetimepicker' || controlType === 'datepicker') {
      // Special date time picker parser
      if (dateValValidation.length > 1) {
        try {
          this.dateTimeValidators = JSON.parse(dateValValidation[1]);
        } catch (e) {
          console.warn('Date validation is invalid, please check manual');
        }
      }
    }
    // this.dateTimeValidators = inputParams.dateTimeValidators;
  }
}
