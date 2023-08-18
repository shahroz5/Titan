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

export class TaxMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.taxMaster.CESSName'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')] })
  // to pass params - { name: PossWebFieldValidators.min, options: { fieldKey: 'Tax Code', params: (new Map).set('min', '20') } },
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.taxCodeField,
        options: { fieldKey: 'pw.taxMaster.CESSName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.taxMaster.CESSName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.taxCodeField
  })
  @Class({ className: ['col'] })
  private taxCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.productCategory.descriptionField'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.productCategory.descriptionField' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.productCategory.descriptionField' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private desctiption: string;

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['col-4', 'pl-0'] })
  // private IsActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    taxCode: string,
    desctiption: string,
    // IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.taxCode = taxCode;
    this.desctiption = desctiption;
    // this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
