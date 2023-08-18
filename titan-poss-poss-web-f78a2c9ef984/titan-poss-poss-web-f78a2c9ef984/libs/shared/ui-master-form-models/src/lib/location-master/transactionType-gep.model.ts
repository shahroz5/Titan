import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class TransactionTypeGEPModel extends DynamicFormFieldsBuilder {
  private id: number;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPPureGoldPurity'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
  //     }
  //   ]
  // })
  // private gepGoldPurity: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPPureSilverPurity'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPPureSilverPurity' }
  //     }
  //   ]
  // })
  // private gepSilverPurity: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPPurePlatinumPurity'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPPurePlatinumPurity' }
  //     }
  //   ]
  // })
  // private gepPlatinumPurity: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPStandaredDeductionGold'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionGold' }
  //     }
  //   ]
  // })
  // private gepDeductionGold: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPStandaredDeductionSilver'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionSilver' }
  //     }
  //   ]
  // })
  // private gepDeductionSilver: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.GEPStandaredDeductionPlatinum'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionPlatinum' }
  //     }
  //   ]
  // })
  // private gepDeductionPlatinum: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({
    className: ['row', 'pw-form-card__checkbox-container']
  })
  private enableGEPSale: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPCancellation'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.GEPCancellation' }
      }
    ]
  })
  private gepCancellation: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.caratacceptedforGEP'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.caratacceptedforGEP' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cpgGroupNameField
  })
  private karatAcceptedForGEP: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({
    className: ['row', 'pw-form-card__checkbox-container', 'mt-2', 'mb-0']
  })
  private isPreMeltingDetailsMandatory: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPHoldTime'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.GEPHoldTime' }
      }
    ]
  })
  private gepHoldTime: string;

  constructor(
    id: number,
    // gepGoldPurity: string,
    // gepSilverPurity: string,
    // gepPlatinumPurity: string,
    // gepDeductionGold: string,
    // gepDeductionSilver: string,
    // gepDeductionPlatinum: string,
    enableGEPSale: { id: string; name: string; checked?: boolean }[],
    gepCancellation: string,
    karatAcceptedForGEP: string,
    isPreMeltingDetailsMandatory: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    gepHoldTime: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    // this.gepGoldPurity = gepGoldPurity;
    // this.gepSilverPurity = gepSilverPurity;
    // this.gepPlatinumPurity = gepPlatinumPurity;
    // this.gepDeductionGold = gepDeductionGold;
    // this.gepDeductionSilver = gepDeductionSilver;
    // this.gepDeductionPlatinum = gepDeductionPlatinum;
    this.enableGEPSale = enableGEPSale;
    this.gepCancellation = gepCancellation;
    this.karatAcceptedForGEP = karatAcceptedForGEP;
    this.isPreMeltingDetailsMandatory = isPreMeltingDetailsMandatory;
    this.gepHoldTime = gepHoldTime;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
