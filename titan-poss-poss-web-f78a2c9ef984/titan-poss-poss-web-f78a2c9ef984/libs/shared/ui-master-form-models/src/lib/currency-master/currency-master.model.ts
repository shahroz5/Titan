// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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

export class CurrencyDetailsMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.currencyMaster.currencyCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.currencyCodeField,
        options: { fieldKey: 'pw.currencyMaster.currencyCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.currencyMaster.currencyCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.currencyCodeField
  })
  @Class({ className: ['col-12'] })
  private currencyCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.currencyMaster.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.currencyMaster.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.currencyMaster.description' }
      }
    ],

    //to restrict the user input as per the max length validation given

    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.currencyMaster.currencySymbol'
  })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.alphaNumericField,
      //   options: { fieldKey: 'pw.currencyMaster.currencySymbol' }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.currencyMaster.currencySymbol' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.alphaNumericField
  })
  @Class({ className: ['col-12'] })
  private currencySymbol: string;

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: [''] })
  // private IsActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    currencyCode: string,
    description: string,
    currencySymbol: string,
    // IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.currencyCode = currencyCode;
    this.description = description;
    this.currencySymbol = currencySymbol;
    // this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
