import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
export class Checks1Model extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.makingCharges'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.makingChargesDigits' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.pattern('^[0-9]*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.makingCharges' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private makingChargesorWastageHeading: number;

  constructor(
    id: number,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    makingChargesorWastageHeading: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.checkBoxes = checkBoxes;
    this.makingChargesorWastageHeading = makingChargesorWastageHeading;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
