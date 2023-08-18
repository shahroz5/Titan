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

export class ItemModelEditPartTwo extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterCFAproductCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.itemMaster.itemMasterCFAproductCode' }
      }
    ]
  })
  private CFAproductCode: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterComplexityCode'
  })
  @Class({ className: ['col-12'] })
  private complexityCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'value',
      valueKey: 'code',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterPricingType'
  })
  @Class({ className: ['col-12'] })
  private pricingType: { code: string; value: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterTaxClass'
  })
  @Class({ className: ['col-12'] })
  private taxClass: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'value',
      valueKey: 'code',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterFindingCode'
  })
  @Class({ className: ['col-12'] })
  private findingCode: { code: string; value: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterSize'
  })
  @Class({ className: ['col-12'] })
  private size: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterFinishing'
  })
  @Class({ className: ['col-12'] })
  private finishing: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'value',
      valueKey: 'code',
      selectedKey: 'selected'
    },
    label: 'pw.itemMaster.itemMasterPricingGroupType'
  })
  @Class({ className: ['col-12'] })
  private pricingGroupType: {
    code: string;
    value: string;
    selected?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterKaratage'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.karatField,
        options: { fieldKey: 'pw.itemMaster.itemMasterKaratage' }
      }
    ],
    inputConstraint: PossWebFieldValidators.karatField
  })
  private karatage: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondKaratage'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.karatField,
        options: { fieldKey: 'pw.itemMaster.itemMasterKaratage' }
      }
    ],
    inputConstraint: PossWebFieldValidators.karatField
  })
  private diamondKaratage: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondClarity'
  })
  @Class({ className: ['col-12'] })
  private diamondClarity: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.itemMaster.itemMasterDiamondColour'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.colorField,
        options: { fieldKey: 'pw.itemMaster.itemMasterDiamondColour' }
      }
    ],
    inputConstraint: PossWebFieldValidators.colorField
  })
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
  @Class({ className: ['col-12 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];
  constructor(
    id: number,
    CFAproductCode: { id: string; name: string; selected?: boolean }[],
    complexityCode: { id: string; name: string; selected?: boolean }[],
    pricingType: { code: string; value: string; selected?: boolean }[],
    taxClass: string,
    findingCode: { code: string; value: string; selected?: boolean }[],
    size: string,
    finishing: string,
    pricingGroupType: { code: string; value: string; selected?: boolean }[],
    karatage: string,
    diamondKaratage: string,
    diamondClarity: string,
    diamondColour: string,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.CFAproductCode = CFAproductCode;
    this.complexityCode = complexityCode;
    this.pricingType = pricingType;
    this.taxClass = taxClass;
    this.findingCode = findingCode;
    this.size = size;
    this.finishing = finishing;
    this.pricingGroupType = pricingGroupType;
    this.karatage = karatage;
    this.diamondKaratage = diamondKaratage;
    this.diamondClarity = diamondClarity;
    this.diamondColour = diamondColour;
    this.checkBoxes = checkBoxes;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
