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

export class PanCardConfiguration extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.configurationAmountForCashMemo'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCashMemo' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCashMemo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private configurationAmountForCashMemo: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.configurationAmountForAdvance'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForAdvance' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForAdvance' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private configurationAmountForAdvance: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private pancardCheckkbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  constructor(
    id: number,
    configurationAmountForCashMemo: string,
    configurationAmountForAdvance: string,
    pancardCheckkbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,

    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.configurationAmountForCashMemo = configurationAmountForCashMemo;
    this.configurationAmountForAdvance = configurationAmountForAdvance;
    this.pancardCheckkbox = pancardCheckkbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
