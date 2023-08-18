import { Validators } from '@angular/forms';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

export class ItemModelViewPartOne extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterStoneWeight'
  })
  @Class({ className: ['col-12'] })
  private stoneWeight: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'Indent Type'
  })
  @Class({ className: ['col-12'] })
  private indentType: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({ validators: [] })
  @Class({ className: ['col-12 pl-0'] })
  private isConsignment: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterWeightDeviation'
  })
  @Class({ className: ['col-12'] })
  private maxWeightDeviation: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterStdWeight'
  })
  @Class({ className: ['col-12'] })
  private stdWeight: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterProductCode'
  })
  @Class({ className: ['col-12'] })
  private productCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterBrandCode'
  })
  @Class({ className: ['col-12'] })
  private brandCode: string;
  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterProductType'
  })
  @Class({ className: ['col-12'] })
  private productType: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterMaterialCode'
  })
  @Class({ className: ['col-12'] })
  private materialCode: string;
  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterSupplyChainCode'
  })
  @Class({ className: ['col-12'] })
  private supplyChainCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterItemNature'
  })
  @Class({ className: ['col-12'] })
  private itemNature: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterStdPrice'
  })
  @Class({ className: ['col-12'] })
  private stdPrice: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterStoneCharges'
  })
  @Class({ className: ['col-12'] })
  private stoneCharges: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterLeadTime'
  })
  @Class({ className: ['col-12'] })
  private leadTime: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterHSNSACCode'
  })
  @Class({ className: ['col-12'] })
  private hsnSacCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterPurity'
  })
  @Class({ className: ['col-12'] })
  private purity: string;
  constructor(
    id: number,
    stoneWeight: string,
    indentType: string,
    isConsignment: { id: string; name: string; checked?: boolean }[],
    maxWeightDeviation: string,
    stdWeight: string,
    productCode: string,
    brandCode: string,
    productType: string,
    materialCode: string,
    supplyChainCode: string,
    itemNature: string,
    stdPrice: string,
    stoneCharges: string,
    leadTime: string,
    hsnSacCode: string,
    purity: string
  ) {
    super();
    this.id = id;
    this.stoneWeight = stoneWeight;
    this.indentType = indentType;
    this.isConsignment = isConsignment;
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
  }
}
