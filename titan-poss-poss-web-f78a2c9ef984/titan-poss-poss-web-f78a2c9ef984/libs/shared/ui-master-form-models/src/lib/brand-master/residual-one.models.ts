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

export class ResidualAmountModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.residualAmountForeGHSTransfer'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.residualAmountForeGHSTransfer' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.residualAmountForeGHSTransfer' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private residualAmountForeGHSTransfer: string;
  constructor(
    id: number,
    residualAmountForeGHSTransfer: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.residualAmountForeGHSTransfer = residualAmountForeGHSTransfer;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
