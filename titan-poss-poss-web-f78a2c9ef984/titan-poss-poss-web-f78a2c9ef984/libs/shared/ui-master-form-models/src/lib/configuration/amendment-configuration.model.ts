import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
export class AmendmentConfigurationModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.amendmentConfig.noOfDaysForApproval'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.amendmentConfig.noOfDaysForApproval' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.amendmentConfig.noOfDaysForApproval' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  @Class({ className: ['col-12'] })
  private noOfDaysForApproval: number;

  constructor(
    id: number,
    noOfDaysForApproval: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.noOfDaysForApproval = noOfDaysForApproval;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
