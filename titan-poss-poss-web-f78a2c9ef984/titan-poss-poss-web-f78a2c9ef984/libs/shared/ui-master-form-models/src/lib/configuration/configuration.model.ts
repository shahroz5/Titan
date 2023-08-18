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

export class ConfigurationModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.ibtConfiguration.configName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.ibtConfiguration.configName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ibtConfiguration.configName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  @Class({ className: ['col-12'] })
  private configName: string;

  constructor(
    id: number,
    configName: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.configName = configName;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
