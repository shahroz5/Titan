import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
export class SubBrandModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.subBrandCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.subBrandCodeField,
        options: { fieldKey: 'pw.brandMaster.subBrandCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.subBrandCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.subBrandCodeField
  })
  @Class({ className: ['col-12'] })
  private subbrandCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.brandMaster.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.description' }
      },
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.brandMaster.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'id',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.brandMaster.parentBrandCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.parentBrandCode' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private parentBrandCode: { id: string; name: string; selected?: boolean }[];

  constructor(
    id: number,
    brandCode: string,
    description: string,
    parentBrandCode: { id: string; name: string; selected?: boolean }[],

    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.subbrandCode = brandCode;
    this.description = description;
    this.parentBrandCode = parentBrandCode;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
