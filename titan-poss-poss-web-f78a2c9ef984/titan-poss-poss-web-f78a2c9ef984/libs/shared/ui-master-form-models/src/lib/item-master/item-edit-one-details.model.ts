// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

export class ItemModelEditPartOne extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[a-zA-Z0-9]{7,14}')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.itemCodeField,
        options: { fieldKey: 'pw.itemMaster.itemMasterCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.itemCodeField
  })
  private itemCode: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterDescription'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.itemMaster.itemMasterDescription' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterDescription' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  private description: string;

  @FormField({
    fieldType: FormFieldType.TEXTWEIGHTINPUT,
    label: 'pw.itemMaster.itemMasterStoneWeight'
  })
  @Class({ className: ['col-12'] })
  private stoneWeight: string;

  @FormField({
    fieldType: FormFieldType.TEXTWEIGHTINPUT,
    label: 'pw.itemMaster.itemMasterWeightDeviation'
  })
  @Class({ className: ['col-12'] })
  private maxWeightDeviation: string;

  @FormField({
    fieldType: FormFieldType.TEXTWEIGHTINPUT,
    label: 'pw.itemMaster.itemMasterStdWeight'
  })
  @Class({ className: ['col-12'] })
  private stdWeight: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterProductCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterProductCode' }
      }
    ]
  })
  private productCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterBrandCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterBrandCode' }
      }
    ]
  })
  private brandCode: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'value',
      valueKey: 'code',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterProductType'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterProductType' }
      }
    ]
  })
  private productType: { code: string; value: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterMaterialCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterMaterialCode' }
      }
    ]
  })
  private materialCode: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'value',
      valueKey: 'code',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterSupplyChainCode'
  })
  @Class({ className: ['col-12'] })
  private supplyChainCode: {
    code: string;
    value: string;
    selected?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterItemNature'
  })
  @Class({ className: ['col-12'] })
  private itemNature: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterStdPrice'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.itemMaster.itemMasterStdPrice' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private stdPrice: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterStoneCharges'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.itemMaster.itemMasterStoneCharges' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private stoneCharges: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterLeadTime'
  })
  @Class({ className: ['col-12'] })
  private leadTime: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterHSNSACCode'
  })
  @Class({ className: ['col-12'] })
  private hsnSacCode: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterPurity'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.purityField,
        options: { fieldKey: 'pw.itemMaster.itemMasterPurity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.purityField
  })
  private purity: string;
  constructor(
    id: number,
    itemCode: string,
    description: string,
    stoneWeight: string,
    maxWeightDeviation: string,
    stdWeight: string,
    productCode: { id: string; name: string; selected?: boolean }[],
    brandCode: { id: string; name: string; selected?: boolean }[],
    productType: { code: string; value: string; selected?: boolean }[],
    materialCode: { id: string; name: string; selected?: boolean }[],
    supplyChainCode: { code: string; value: string; selected?: boolean }[],
    itemNature: string,
    stdPrice: string,
    stoneCharges: string,
    leadTime: string,
    hsnSacCode: string,
    purity: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.itemCode = itemCode;
    this.description = description;
    this.stoneWeight = stoneWeight;
    this.maxWeightDeviation = maxWeightDeviation;
    this.stdWeight = stdWeight;
    this.productCode = productCode;
    this.brandCode = brandCode;
    this.productType = productType;
    this.materialCode = materialCode;
    this.supplyChainCode = supplyChainCode;
    this.itemNature = itemNature;
    this.stdPrice = stdPrice;
    this.stoneCharges = stoneCharges;
    this.leadTime = leadTime;
    this.hsnSacCode = hsnSacCode;
    this.purity = purity;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
