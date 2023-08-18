import {
  FormField,
  FormFieldType,
  Validation,
  DynamicFormFieldsBuilder,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class CashBackOfferConfigOneModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.cashbackConfig.cashBackName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.cashbackNameField,
        options: { fieldKey: 'pw.cashbackConfig.cashBackName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.cashBackName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cashbackNameField
  })
  @Class({ className: ['col-4'] })
  private cashBackName: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.cashbackConfig.cardBankName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.cardBankName' }
      }
    ]
  })
  @Class({ className: ['col-4'] })
  private bankName: { id: string; name: string }[];

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['col-auto ml-auto align-self-center'] })
  // private isActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    cashBackName: string,
    bankName: { id: string; name: string; checked?: boolean }[],

    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.cashBackName = cashBackName;
    this.bankName = bankName;

    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
