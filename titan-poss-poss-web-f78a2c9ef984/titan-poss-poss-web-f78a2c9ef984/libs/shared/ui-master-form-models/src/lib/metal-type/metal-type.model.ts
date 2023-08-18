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

export class MetalTypeModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.metalType.materialCodeLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.materialCodeField,
        options: { fieldKey: 'pw.metalType.materialCodeLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.metalType.materialCodeLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.materialCodeField
  })
  @Class({ className: ['col-12'] })
  private materialCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.metalType.descriptionLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.metalType.descriptionLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.metalType.descriptionLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    materialCode: string,

    description: string,

    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.materialCode = materialCode;

    this.description = description;

    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
