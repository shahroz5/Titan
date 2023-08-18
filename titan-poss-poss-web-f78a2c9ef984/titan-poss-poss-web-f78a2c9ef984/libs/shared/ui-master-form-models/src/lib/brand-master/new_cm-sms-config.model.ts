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

export class CmSMSConfigModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.residualAmountForeGHSTransfer'
  })
  @Class({ className: [] })
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
    inputConstraint: PossWebFieldValidators.localeField
  })
  private residualAmountForeGHSTransfer: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.SMSUserName'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.alphaNumericField,
        options: { fieldKey: 'pw.brandMaster.SMSUserName' }
      }
    ]
  })
  private smsUserName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.SMSPassword'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.alphaNumericField,
        options: { fieldKey: 'pw.brandMaster.SMSPassword' }
      }
    ]
  })
  private smsPassword: string;

  constructor(
    id: number,
    residualAmountForeGHSTransfer: string,
    smsUserName: string,
    smsPassword: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.residualAmountForeGHSTransfer = residualAmountForeGHSTransfer;
    this.smsUserName = smsUserName;
    this.smsPassword = smsPassword;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
