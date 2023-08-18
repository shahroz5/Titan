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

export class TcsConfigJewelryModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'Cash amount'
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
  private cashAmountJ: string;

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
  private netInvoiceAmountJ: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.panCardPer'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.brandMaster.panCardPer' }
      }
    ],
    inputConstraint: PossWebFieldValidators.quantityField
  })
  private panCardPercent: string;

  constructor(
    id: number,
    cashAmountJ: string,
    netInvoiceAmountJ: string,
    PanCardPercent: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.cashAmountJ = cashAmountJ;
    this.netInvoiceAmountJ = netInvoiceAmountJ;
    this.panCardPercent = PanCardPercent;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
