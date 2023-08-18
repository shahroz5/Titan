import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class TcsConfigModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: [''] })
  private tcsBasedOnMobileNumberOrUlpNumberRadio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'TCS Applicable Amount'
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
  private tcsApplicableAmount: string;

  constructor(
    id: number,
    tcsBasedOnMobileNumberOrUlpNumberRadio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    tcsApplicableAmount: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.tcsBasedOnMobileNumberOrUlpNumberRadio = tcsBasedOnMobileNumberOrUlpNumberRadio;
    this.tcsApplicableAmount = tcsApplicableAmount;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
