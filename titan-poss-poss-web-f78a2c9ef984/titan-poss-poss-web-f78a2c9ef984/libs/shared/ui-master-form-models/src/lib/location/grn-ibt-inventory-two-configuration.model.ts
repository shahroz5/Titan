import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class IBTConfiguration extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.noOfTimesRequestedInCurrentMonth'
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
        options: { fieldKey: 'pw.countryMaster.countryName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private noOfTimesRequestedInCurrentMonth: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.totalValueRequestedInCurrentMonth'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('[+]?([0-9]*[.])?[0-9]+')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private totalValueRequestedInCurrentMonth: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.noOfItemsRequestedInCurrentMonth'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('[+]?[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private noOfItemsRequestedInCurrentMonth: string;
  constructor(
    id: number,
    noOfTimesRequestedInCurrentMonth: string,
    totalValueRequestedInCurrentMonth: string,
    noOfItemsRequestedInCurrentMonth: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.noOfTimesRequestedInCurrentMonth = noOfTimesRequestedInCurrentMonth;
    this.totalValueRequestedInCurrentMonth = totalValueRequestedInCurrentMonth;
    this.noOfItemsRequestedInCurrentMonth = noOfItemsRequestedInCurrentMonth;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
