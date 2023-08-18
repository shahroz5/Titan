import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
export class GiftCardConfiguration extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.maximumAmount'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[+]?([0-9]*[.])?[0-9]+')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.maximumAmount' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private maximumAmount: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.minimumAmount'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[+]?([0-9]*[.])?[0-9]+')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.minimumAmount' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private minimumAmount: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.multiplesValues'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.multiplesValues' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private multiplesValues: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({ validators: [] })
  @Class({ className: ['col-12 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    maximumAmount: string,
    minimumAmount: string,
    multiplesValues: string,
    checkboxes: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.maximumAmount = maximumAmount;
    this.minimumAmount = minimumAmount;
    this.multiplesValues = multiplesValues;
    this.checkBoxes = checkboxes;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
