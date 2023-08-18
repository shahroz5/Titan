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

export class TcsConfigApplicableRatesInternationalModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.tcsApplicablePer'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.brandMaster.tcsApplicablePer' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private tcsApplicableRatesPanCardPercentRegular: string;

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
  private tcsApplicableRatesRegular_checkBox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    tcsApplicableRatesPanCardPercentRegular: string,
    tcsApplicableRatesRegular_checkBox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.tcsApplicableRatesPanCardPercentRegular = tcsApplicableRatesPanCardPercentRegular;
    this.tcsApplicableRatesRegular_checkBox = tcsApplicableRatesRegular_checkBox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
