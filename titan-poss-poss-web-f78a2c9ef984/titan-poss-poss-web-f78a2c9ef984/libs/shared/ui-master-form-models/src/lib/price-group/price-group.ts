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

export class PriceGroupModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.priceGroup.priceGroupLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.priceGroupCodeField,
        options: { fieldKey: 'pw.priceGroup.priceGroupLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.priceGroup.priceGroupLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.priceGroupCodeField
  })
  @Class({ className: ['col-12'] })
  private priceGroup: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.priceGroup.descriptionLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.priceGroup.descriptionLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.priceGroup.descriptionLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    priceGroup: string,
    description: string,

    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.priceGroup = priceGroup;
    this.description = description;

    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
