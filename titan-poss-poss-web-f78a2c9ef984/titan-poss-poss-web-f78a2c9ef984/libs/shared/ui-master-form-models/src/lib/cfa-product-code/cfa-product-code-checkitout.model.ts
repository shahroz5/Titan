import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import { PossWebFieldValidators } from '@poss-web/shared/util-field-validators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
export class CFAProductCodeCheckItOuts extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.tepIssueOutCategoryLabel'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'PlainStuddedTep' }
      }
    ]
  })
  private plainStuddedTep: {
    id: string;
    name: string;
    selected?: boolean;
  }[];

  // private hallmarkingExcludeKaratType: { id: string; name: string; selected?: boolean }[];
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
  //       name: PossWebFieldValidators.priceGroupCodeField,
  //       options: { fieldKey: 'hallmarkingExcludeKaratType' }
  //     }
  //   ]
  // })

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.CFAProduct.pricingTypeLabel'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pricingType' }
      }
    ]
  })
  private pricingType: {
    id: string;
    name: string;
    selected?: boolean;
  }[];
  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-7 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];



  constructor(
    id: number,
    plainStuddedTep: { id: string; name: string }[],
    pricingType: { id: string; name: string }[],
    //hallmarkingExcludeKaratType: { id: string; name: string; selected?: boolean }[],
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.plainStuddedTep = plainStuddedTep;
    this.pricingType = pricingType;
    //this.hallmarkingExcludeKaratType= hallmarkingExcludeKaratType;
    this.checkBoxes = checkBoxes;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
