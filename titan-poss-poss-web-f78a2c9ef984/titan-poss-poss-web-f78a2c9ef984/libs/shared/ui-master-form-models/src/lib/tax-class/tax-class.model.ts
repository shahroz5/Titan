// import { Validators } from '@angular/forms';
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

export class TaxClass extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.taxClass.taxClassCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.taxClassCodeField,
        options: { fieldKey: 'pw.taxClass.taxClassCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.taxClass.taxClassCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.taxClassCodeField
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')] })
  @Class({ className: ['col'] })
  private taxClassCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.taxClass.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.taxClass.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.taxClass.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[-a-zA-Z0-9-/]+(\\s+[-a-zA-Z0-9-/]+)*$')] })
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
    taxClassCode: string,
    desctiption: string,
    // IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.taxClassCode = taxClassCode;
    this.desctiption = desctiption;
    // this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
