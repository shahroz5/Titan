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
export class GRNConfiguration extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.noOfDaysGRNAllowed'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage:'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysGRNAllowed' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private noOfDaysGRNAllowed: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maximumNoOfDaysForApprovedGRN'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage:'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern'}]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.maximumNoOfDaysForApprovedGRN' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private maximumNoOfDaysForApprovedGRN: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.noOfDaySToProtectGoldRateForGRN'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage:'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('[+]?([0-9]*[.])?[0-9]+')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.noOfDaySToProtectGoldRateForGRN'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private noOfDaySToProtectGoldRateForGRN: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.minimumUtilization'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage:'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('[+]?([0-9]*[.])?[0-9]+')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.minimumUtilization' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private minimumUtilization: string;

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
    noOfDaysGRNAllowed: string,
    maximumNoOfDaysForApprovedGRN: string,
    noOfDaySToProtectGoldRateForGRN: string,
    minimumUtilization: string,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.noOfDaysGRNAllowed = noOfDaysGRNAllowed;
    this.maximumNoOfDaysForApprovedGRN = maximumNoOfDaysForApprovedGRN;
    this.noOfDaySToProtectGoldRateForGRN = noOfDaySToProtectGoldRateForGRN;
    this.minimumUtilization = minimumUtilization;
    this.checkBoxes = checkBoxes;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
