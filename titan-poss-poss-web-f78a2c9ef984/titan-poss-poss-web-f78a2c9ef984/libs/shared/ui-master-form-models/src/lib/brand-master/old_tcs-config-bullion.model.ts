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

export class TcsConfigBullionModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.cashAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.cashAmount' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private cashAmount: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.unitWeight'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.brandMaster.unitWeight' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private unitWeight: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.netInvoiceAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.netInvoiceAmount' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private netInvoiceAmount: string;

  constructor(
    id: number,
    cashAmount: string,
    unitWeight: string,
    netInvoiceAmount: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.cashAmount = cashAmount;
    this.unitWeight = unitWeight;
    this.netInvoiceAmount = netInvoiceAmount;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
