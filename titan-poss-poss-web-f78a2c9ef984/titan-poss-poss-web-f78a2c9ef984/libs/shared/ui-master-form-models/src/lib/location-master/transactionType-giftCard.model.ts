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

export class TransactionTypeGiftCardModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.maximumAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.maximumAmount' }
      }
    ]
  })
  private maxAmount: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.minimumAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.minimumAmount' }
      }
    ]
  })
  private minAmount: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.multiplesValues'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.multiplesValues' }
      }
    ]
  })
  private multiplesValue: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private giftCardCheckbox: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    maxAmount: string,
    minAmount: string,
    multiplesValue: string,
    giftCardCheckbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.maxAmount = maxAmount;
    this.minAmount = minAmount;
    this.multiplesValue = multiplesValue;
    this.giftCardCheckbox = giftCardCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
