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

export class CountryDetailsMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.countryCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.countryCodeField,
        options: { fieldKey: 'pw.countryMaster.countryCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.countryCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.countryCodeField
  })
  @Class({ className: ['col-12'] })
  private countryCode: string;

  // @FormField({
  //   fieldType: FormFieldType.SELECT,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'selected'
  //   },
  //   label: 'Country Name'
  // })
  // @Validation({ validators: [] })
  // @Class({ className: ['col-12'] })
  // private countryName: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.countryName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.countryNameField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.countryNameField
  })
  @Class({ className: ['col-12'] })
  private countryName: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.countryMaster.currencyCode'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.currencyCode' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private currencyCode: { id: string; name: string; selected?: boolean }[];

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.countryMaster.dateFormats'
  // })
  // // @Validation({ validators: [Validators.required] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.requiredField,
  //       options: { fieldKey: 'pw.countryMaster.dateFormat' }
  //     }
  //   ]
  // })
  // @Class({ className: ['col-12'] })
  // private dateFormat: string;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.countryMaster.dateFormats'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.dateFormats' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private dateFormat: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.countryMaster.startFinancialMonth'
  })
  @Class({ className: ['col-12'] })
  private fiscalMonthStart: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.isdCode'
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9+]*$')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.contactNoField,
        options: { fieldKey: 'pw.countryMaster.isdCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.isdCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.contactNoField
  })
  @Class({ className: ['col-6'] })
  private isdCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.phoneLength'
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9.]*$')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.countryMaster.phoneLength' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  @Class({ className: ['col-6'] })
  private phoneLength: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.locale'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.localeField,
        options: { fieldKey: 'pw.countryMaster.locale' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.locale' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  @Class({ className: ['col-12'] })
  private locale: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.countryMaster.timeFormat'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.timeFormat' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private timeFormat: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.countryMaster.financialYear'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.countryMaster.financialYear' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  @Class({ className: ['col-12'] })
  private fiscalYear: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Unit of Weight'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Unit of Weight' }
      },
      {
        name: PossWebFieldValidators.alphabetsField,
        options: { fieldKey: 'Unit of Weight' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private weightUnit: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Stone Weight Unit'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Stone Weight Unit' }
      },
      {
        name: PossWebFieldValidators.alphabetsField,
        options: { fieldKey: 'Stone Weight Unit' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private stoneWeightUnit: string;

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // // @Class({ className: ['col-12'] })
  // @Class({ className: ['col-4', 'pl-0'] })
  // private IsActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    countryCode: string,
    countryName: string,
    currencyCode: { id: string; name: string; selected?: boolean }[],
    dateFormat: { id: string; name: string; selected?: boolean }[],
    fiscalMonthStart: { id: string; name: string; selected?: boolean }[],
    isdCode: string,
    phoneLength: string,
    locale: string,
    timeFormat: { id: string; name: string; selected?: boolean }[],
    fiscalYear: number,
    weightUnit: string,
    stoneWeightUnit: string,
    // IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.countryCode = countryCode;
    this.countryName = countryName;
    this.currencyCode = currencyCode;
    this.dateFormat = dateFormat;
    this.fiscalMonthStart = fiscalMonthStart;
    this.isdCode = isdCode;
    this.phoneLength = phoneLength;
    this.locale = locale;
    this.timeFormat = timeFormat;
    this.fiscalYear = fiscalYear;
    this.weightUnit = weightUnit;
    this.stoneWeightUnit = stoneWeightUnit;
    // this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
