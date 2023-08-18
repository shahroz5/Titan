import { Validators } from '@angular/forms';
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

export class CFAProductCodeDetails extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.CFAProduct.productGroup'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.productGroupCodeField,
        options: { fieldKey: 'pw.CFAProduct.productGroupLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.CFAProduct.productGroupLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.productGroupCodeField
  })
  private CFAProductCode: string;
  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Validation({ validators: [] })
  // @Class({ className: ['col-12 pl-0'] })
  // private isActive: { id: string; name: string; checked?: boolean }[];
  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.CFAProduct.description'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.CFAProduct.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.CFAProduct.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  private description: string;

  @FormField({
    fieldType: FormFieldType.TEXTWEIGHTINPUT,
    label: 'pw.CFAProduct.hallmarkingExcludeGramsLable'
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.weightField,
  //       options: { fieldKey: 'hallmarkingExcludeGrams' }
  //     },
  //   ],
  // })
  private hallmarkingExcludeGrams: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({ validators: [Validators.required] })
  @Class({ className: ['col-12 pl-0'] })
  private isMia: { id: string; name: string; checked?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.metalType'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.CFAProduct.metalType' }
      }
    ]
  })
  private metalType: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.isPlainLabel'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'PlainStudded' }
      }
    ]
  })
  private plainStudded: { id: string; name: string; selected?: boolean }[];

  // @FormField({
  //   fieldType: FormFieldType.MULTISELECT,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'selected'
  //   },
  //   label: 'pw.CFAProduct.hallmarkingExcludeKaratLable'
  // })
  // @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.requiredField,
  //       options: { fieldKey: 'hallmarkingExcludeKarat' }
  //     }
  //   ]
  // })
  // private hallmarkingExcludeKarat: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.grnPlainLabel'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'PlainStuddedGrn' }
      }
    ]
  })
  private plainStuddedGrn: {
    id: string;
    name: string;
    selected?: boolean;
  }[];


  @FormField({
    fieldType: FormFieldType.MULTISELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.hallmarkingExcludeKaratLable'
  })

  @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.,
  //       options: { fieldKey: 'hallmarkingExcludeKarat' }
  //     }
  //   ]
  // })
  private hallmarkingExcludeKaratType: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.isgrfStuddedCategory'
  })

  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'PlainStuddedGrf' }
      }
    ]
  })
  private plainStuddedGrf: {
    id: string;
    name: string;
    selected?: boolean;
  }[];




  constructor(
    id: number,
    CFAProductCode: string,
    //isActive: { id: string; name: string; checked?: boolean }[],
    description: string,
    hallmarkingExcludeGrams:number,
    isMia: { id: string; name: string; checked?: boolean }[],
    metalType: { id: string; name: string; selected?: boolean }[],
    plainStudded: { id: string; name: string; selected?: boolean }[],
    plainStuddedGrn: { id: string; name: string; selected?: boolean }[],
    plainStuddedGrf: { id: string; name: string; selected?: boolean }[],
    hallmarkingExcludeKaratType: { id: string; name: string; selected?: boolean }[],
    // pricingType: { id: string; name: string; selected?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.CFAProductCode = CFAProductCode;
    //this.isActive = isActive;
    this.description = description;
    this.hallmarkingExcludeGrams =hallmarkingExcludeGrams;
    this.isMia = isMia;
    this.metalType = metalType;
    this.plainStudded = plainStudded;
    this.plainStuddedGrn = plainStuddedGrn;
    this.plainStuddedGrf = plainStuddedGrf;
    this.hallmarkingExcludeKaratType= hallmarkingExcludeKaratType;
    // this.plainStuddedTep = plainStuddedTep;
    // this.pricingType = pricingType;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
