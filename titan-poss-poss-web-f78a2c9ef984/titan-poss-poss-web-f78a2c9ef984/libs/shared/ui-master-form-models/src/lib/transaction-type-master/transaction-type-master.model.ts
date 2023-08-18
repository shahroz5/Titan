// import { Validators } from '@angular/forms';
import { DynamicFormFieldsBuilder, FormField, FormFieldType, Validation, Class } from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService, PossWebFieldValidators } from '@poss-web/shared/util-field-validators';


export class TransactionTypeMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.transactionType.CodeField'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')] })
  @Validation({
    customValidators: [
      { name: PossWebFieldValidators.alphaNumericField, options: { fieldKey: 'pw.transactionType.CodeField' } },
      { name: PossWebFieldValidators.requiredField, options: { fieldKey: 'pw.transactionType.CodeField' } },
    ],
    inputConstraint: PossWebFieldValidators.alphaNumericField
  })
  @Class({ className: ['col', 'transform'] })
  private code: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.transactionType.description'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[-a-zA-Z0-9-/]+(\\s+[-a-zA-Z0-9-/]+)*$')] })
  @Validation({
    customValidators: [
      { name: PossWebFieldValidators.descriptionField, options: { fieldKey: 'pw.transactionType.description' } },
      { name: PossWebFieldValidators.requiredField, options: { fieldKey: 'pw.transactionType.description' } },
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private value: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-4', 'pl-0'] })
  private IsActive: { id: string; name: string; checked?: boolean }[];


  constructor(
    id: number,
    code: string,
    value: string,
    IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.code = code;
    this.value = value;
    this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
