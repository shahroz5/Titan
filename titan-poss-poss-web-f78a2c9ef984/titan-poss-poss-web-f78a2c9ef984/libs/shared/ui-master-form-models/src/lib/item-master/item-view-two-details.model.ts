
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

export class ItemModelViewPartTwo extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterCFAproductCode'
  })
  @Class({ className: ['col-12'] })
  private CFAproductCode: string;
  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterComplexityCode'
  })
  @Class({ className: ['col-12'] })
  private complexityCode: string;
  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'Inventory Type'
  })
  @Class({ className: ['col-12'] })
  private inventoryType: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterPricingType'
  })
  @Class({ className: ['col-12'] })
  private pricingType: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterTaxClass'
  })
  @Class({ className: ['col-12'] })
  private taxClass: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterFindingCode'
  })
  @Class({ className: ['col-12'] })
  private findingCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterSize'
  })
  @Class({ className: ['col-12'] })
  private size: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterFinishing'
  })
  @Class({ className: ['col-12'] })
  private finishing: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterPricingGroupType'
  })
  @Class({ className: ['col-12'] })
  private pricingGroupType: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterPriceFactor'
  })
  @Class({ className: ['col-12'] })
  private priceFactor: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterKaratage'
  })
  @Class({ className: ['col-12'] })
  private karatage: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondKaratage'
  })
  @Class({ className: ['col-12'] })
  private diamondKaratage: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondClarity'
  })
  @Class({ className: ['col-12'] })
  private diamondClarity: string;

  @FormField({
    fieldType: FormFieldType.TEXT_OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondColour'
  })
  @Class({ className: ['col-12'] })
  private diamondColour: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-5 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    CFAproductCode: string,
    complexityCode: string,
    inventoryType: string,
    pricingType: string,
    taxClass: string,
    findingCode: string,
    size: string,
    finishing: string,
    pricingGroupType: string,
    priceFactor: string,
    karatage: string,
    diamondKaratage: string,
    diamondClarity: string,
    diamondColour: string,
    checkBoxes: { id: string; name: string; checked?: boolean }[]
  ) {
    super();
    this.id = id;
    this.CFAproductCode = CFAproductCode;
    this.complexityCode = complexityCode;
    this.inventoryType = inventoryType;
    this.pricingType = pricingType;
    this.taxClass = taxClass;
    this.findingCode = findingCode;
    this.size = size;
    this.finishing = finishing;
    this.pricingGroupType = pricingGroupType;
    this.priceFactor = priceFactor;
    this.karatage = karatage;
    this.diamondKaratage = diamondKaratage;
    this.diamondClarity = diamondClarity;
    this.diamondColour = diamondColour;
    this.checkBoxes = checkBoxes;
  }
}
