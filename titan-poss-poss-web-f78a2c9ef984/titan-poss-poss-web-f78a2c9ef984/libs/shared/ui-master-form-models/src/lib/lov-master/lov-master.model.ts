// import { Validators } from '@angular/forms';
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

export class LovMasterModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'value',
      selectedKey: 'selected'
    },
    label: 'Select LOV type'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'LOV type' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private lovType: { value: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'LOV Name'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'LOV Name' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'LOV Name' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  @Class({ className: ['col-12'] })
  private lovCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'Description'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'Description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Description' }
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
  // // @Validation({ validators: [Validators.required] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.requiredField,
  //       options: { fieldKey: 'Select LOV type' }
  //     }
  //   ]
  // })
  // private isActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    lovType: { value: string; name: string; checked?: boolean }[],
    lovCode: string,
    desctiption: string,
    // isActive: {
    //   id: string;
    //   name: string;
    //   checked?: boolean;
    // }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.lovType = lovType;
    this.lovCode = lovCode;
    this.desctiption = desctiption;
    // this.isActive = isActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
