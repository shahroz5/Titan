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
export class Tep extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.noOfDaysForFVTPassword'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]*')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysForFVTPassword' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysForFVTPassword' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private noOfDaysForFVTPassword: string;

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
  private enableRTGSRefund: { id: string; name: string; checked?: boolean }[];
  constructor(
    id: number,
    noOfDaysForFVTPassword: string,
    enableRTGSRefund: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.noOfDaysForFVTPassword = noOfDaysForFVTPassword;
    this.enableRTGSRefund = enableRTGSRefund;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
