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

export class ComplexityPriceGroupMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.complexityPricegroupMapping.complexityCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.complexityPricegroupMapping.complexityCode' }
      }
    ]
  })
  private complexityCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.complexityPricegroupMapping.priceGroup'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.complexityPricegroupMapping.priceGroup' }
      }
    ]
  })
  private priceGroup: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.complexityPricegroupMapping.makingChargesPerUnit'
  })
  // @Validation({ validators: [Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: {
          fieldKey: 'pw.complexityPricegroupMapping.makingChargesPerUnit'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-12'] })
  private makingChargesPerUnit: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.complexityPricegroupMapping.makingChargesPerGram'
  })
  // @Validation({ validators: [Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: {
          fieldKey: 'pw.complexityPricegroupMapping.makingChargesPerGram'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-12'] })
  private makingChargesPerGram: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.complexityPricegroupMapping.wastagePercentage'
  })
  // @Validation({ validators: [Validators.required,Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: {
          fieldKey: 'pw.complexityPricegroupMapping.wastagePercentage'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.complexityPricegroupMapping.wastagePercentage'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  @Class({ className: ['col-12'] })
  private wastagePercentage: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.complexityPricegroupMapping.makingChargesPercentage'
  })
  // @Validation({ validators: [Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: {
          fieldKey: 'pw.complexityPricegroupMapping.makingChargesPercentage'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  @Class({ className: ['col-12'] })
  private makingChargesPercentage: string;

  constructor(
    id: number,
    complexityCode: { id: string; name: string; selected?: boolean }[],
    priceGroup: { id: string; name: string; selected?: boolean }[],
    makingChargesPerUnit: string,
    makingChargesPerGram: string,
    wastagePercentage: string,
    makingChargesPercentage: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.complexityCode = complexityCode;
    this.priceGroup = priceGroup;
    this.makingChargesPerGram = makingChargesPerGram;
    this.makingChargesPerUnit = makingChargesPerUnit;
    this.wastagePercentage = wastagePercentage;
    this.makingChargesPercentage = makingChargesPercentage;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
