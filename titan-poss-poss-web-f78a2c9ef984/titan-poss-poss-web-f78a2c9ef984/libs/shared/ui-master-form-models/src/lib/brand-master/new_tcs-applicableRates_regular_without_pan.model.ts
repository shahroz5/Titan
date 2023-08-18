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

export class TcsConfigApplicableRatesRegularWithoutPanModel extends DynamicFormFieldsBuilder {
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

  constructor(
    id: number,
    tcsApplicableRatesPanCardPercentRegular: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.tcsApplicableRatesPanCardPercentRegular = tcsApplicableRatesPanCardPercentRegular;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
