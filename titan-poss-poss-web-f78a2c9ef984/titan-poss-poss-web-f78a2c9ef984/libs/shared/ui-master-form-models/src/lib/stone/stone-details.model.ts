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

export class StoneDetailsMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.stone.stoneCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.stoneCodeField,
        options: { fieldKey: 'pw.stone.stoneCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.stoneCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.stoneCodeField
  })
  @Class({ className: ['col-12'] })
  private stoneCode: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.stone.stoneTypeCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.stoneTypeCode' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private stoneTypeCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXTWEIGHTINPUT,
    label: 'pw.stone.weights'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.stone.weights' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.weights' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  @Class({ className: ['col-12'] })
  private stdWeight: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.stone.color'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.colorField,
        options: { fieldKey: 'pw.stone.color' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.color' }
      }
    ],
    inputConstraint: PossWebFieldValidators.colorField
  })
  @Class({ className: ['col-12'] })
  private color: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.stone.price'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.stone.price' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.price' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-12'] })
  private stdValue: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.stone.stoneQuality'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.stoneQualityField,
        options: { fieldKey: 'pw.stone.stoneQuality' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.stoneQuality' }
      }
    ],
    inputConstraint: PossWebFieldValidators.stoneQualityField
  })
  @Class({ className: ['col-12'] })
  private stoneQuality: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.stone.discount'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.stone.discount' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stone.discount' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-12'] })
  private discount: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-8'] })
  private isActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    stoneCode: string,
    stoneTypeCode: { id: string; name: string; selected?: boolean }[],
    stdWeight: string,
    color: string,
    stdValue: string,
    stoneQuality: string,
    discount: string,
    isActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.stoneCode = stoneCode;
    this.stoneTypeCode = stoneTypeCode;
    this.stdWeight = stdWeight;
    this.color = color;
    this.stdValue = stdValue;
    this.stoneQuality = stoneQuality;
    this.discount = discount;
    this.isActive = isActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
