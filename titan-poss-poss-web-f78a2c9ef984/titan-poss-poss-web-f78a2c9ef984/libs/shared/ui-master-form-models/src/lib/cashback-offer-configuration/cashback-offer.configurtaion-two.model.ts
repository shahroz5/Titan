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

export class CasbackOfferConfigTwoModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.DATE,
    min: true,
    label: 'pw.cashbackConfig.startDate'
  })
  @Class({ className: ['col-6'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.startDate' }
      }
    ]
  })
  private startDate: Date;

  @FormField({
    fieldType: FormFieldType.DATE,
    label: 'pw.cashbackConfig.endDate',
    min: 'pw.cashbackConfig.startDate'
  })
  @Class({ className: ['col-6'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.endDate' }
      }
    ]
  })
  private endDate: Date;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashbackConfig.noOfCardDigits'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numberOfCardDigitsField,
        options: { fieldKey: 'pw.cashbackConfig.noOfCardDigits' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.noOfCardDigits' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numberOfCardDigitsField
  })
  @Class({ className: ['col-12'] })
  private noOfCardDigits: string;

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'pw.cashbackConfig.digitsToBeValidatedFromFirst'
  })
  @Class({ className: ['col-12'] })
  private digitsToBeValidatedFromFirst: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashbackConfig.noOfdigitsToBeValidated'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.singleNumberField,
        options: { fieldKey: 'pw.cashbackConfig.digitsTobeValidated' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.digitsTobeValidated' }
      }
    ],
    inputConstraint: PossWebFieldValidators.singleNumberField
  })
  @Class({ className: ['col-12 '] })
  private digitsTobeValidated: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashbackConfig.noOfTimesCardAllowed'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.noOfTimesCardAllowedField,
        options: { fieldKey: 'pw.cashbackConfig.noOfTimesCardAllowed' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.noOfTimesCardAllowed' }
      }
    ],
    inputConstraint: PossWebFieldValidators.noOfTimesCardAllowedField
  })
  @Class({ className: ['col-12 '] })
  private noOfTimesCardAllowed: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private validateMobileNo: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private excludeCashBack: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.cashbackConfig.cmRemarks'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.remarkField,
        options: { fieldKey: 'pw.cashbackConfig.cmRemarks' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.cmRemarks' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  @Class({ className: ['col-12'] })
  private cmRemarks: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.cashbackConfig.cashBackOfferRemarks'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.remarkField,
        options: { fieldKey: 'pw.cashbackConfig.cashBackOfferRemarks' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashbackConfig.cashBackOfferRemarks' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  @Class({ className: ['col-12'] })
  private cashBackOfferRemarks: string;

  constructor(
    id: number,

    startDate: Date,
    endDate: Date,
    noOfCardDigits: string,
    digitsToBeValidatedFromFirst: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    digitsTobeValidated: string,
    noOfTimesCardAllowed: string,
    validateMobileNo: { id: string; name: string; checked?: boolean }[],
    excludeCashBack: { id: string; name: string; checked?: boolean }[],
    cmRemarks: string,
    cashBackOfferRemarks: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;

    this.startDate = startDate;
    this.endDate = endDate;
    this.noOfCardDigits = noOfCardDigits;
    this.digitsToBeValidatedFromFirst = digitsToBeValidatedFromFirst;
    this.digitsTobeValidated = digitsTobeValidated;
    this.noOfTimesCardAllowed = noOfTimesCardAllowed;
    this.validateMobileNo = validateMobileNo;
    this.excludeCashBack = excludeCashBack;
    this.cmRemarks = cmRemarks;
    this.cashBackOfferRemarks = cashBackOfferRemarks;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
