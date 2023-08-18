// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';

export class GHSDayDetailsModelValidityConfig extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.ddValidity'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.ddValidityDigits' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]*$')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.ddValidity' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.ddValidity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private ddValidityDays: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.consolidatedAttempts'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.consolidatedAttemptsDigits' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]*$')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.consolidatedAttempts' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.consolidatedAttempts' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private consolidatedAttempts: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.reversalDays'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.reversalDaysDigits' }]
  })
  // @Validation({
  // validators: [Validators.required, Validators.pattern('^[0-9]*$')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.reversalDays' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.reversalDays' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private reversalDays: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.realisationDays'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.realisationDaysDigits' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.pattern('^[0-9]*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.realisationDays' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.realisationDays' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private realisationDays: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.validityDays'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.validityDaysDigits' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]*$')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.validityDays' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.validityDays' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDays: number;

  constructor(
    id: number,
    ddValidityDates: number,
    consolidatedAttempts: number,
    realisationDays: number,
    validityDays: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.ddValidityDays = ddValidityDates;
    this.consolidatedAttempts = consolidatedAttempts;
    this.realisationDays = realisationDays;
    this.validityDays = validityDays;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
