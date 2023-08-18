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

export class ComplexityCodeModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.complexityCode.complexityCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.complexityCodeField,
        options: { fieldKey: 'pw.complexityCode.complexityCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.complexityCode.complexityCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.complexityCodeField
  })
  @Class({ className: ['col-12'] })
  private complexityCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.complexityCode.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.complexityCode.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    complexityCode: string,
    description: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.complexityCode = complexityCode;
    this.description = description;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
