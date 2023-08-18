import {
  FormField,
  FormFieldType,
  Validation,
  DynamicFormFieldsBuilder,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class PurityModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.purity.materialCodeLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.purity.materialCodeLable' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private materialCode: { id: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.purity.purityLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.purityField,
        options: { fieldKey: 'pw.purity.purityLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.purity.purityLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.purityField
  })
  @Class({ className: ['col-12'] })
  private purity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.purity.karat'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.karatField,
        options: { fieldKey: 'pw.purity.karat' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.purity.karat' }
      }
    ],
    inputConstraint: PossWebFieldValidators.karatField
  })
  @Class({ className: ['col-12'] })
  private karat: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.purity.offsetLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.offsetField,
        options: { fieldKey: 'pw.purity.offsetLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.purity.offsetLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.offsetField
  })
  @Class({ className: ['col-12'] })
  private offset: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.purity.descriptionLable'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.purity.descriptionLable' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.purity.descriptionLable' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({
    validators: [Validators.required]
  })
  @Class({ className: ['col-6', 'pl-0'] })
  private isActive: { id: string; name: string; checked: boolean }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({
    validators: [Validators.required]
  })
  @Class({ className: ['col-4'] })
  private isDisplayed: { id: string; name: string; checked: boolean }[];

  constructor(
    id: number,
    materialCode: { id: string; name: string }[],
    purity: string,
    karat: string,
    offset: string,
    description: string,

    isDisplayed: { id: string; name: string; checked: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.materialCode = materialCode;
    this.purity = purity;
    this.karat = karat;
    this.offset = offset;
    this.description = description;
    this.isDisplayed = isDisplayed;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
