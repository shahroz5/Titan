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

export class PersonalDetails extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPPureGoldPurity'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.purityField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.purityField
  })
  private GEPPureGoldPurity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPPureSilverPurity'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.purityField,
        options: { fieldKey: 'pw.locationMaster.GEPPureSilverPurity' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPPureSilverPurity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.purityField
  })
  private GEPPureSilverPurity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPPurePlatinumPurity'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.purityField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.purityField
  })
  private GEPPurePlatinumPurity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPStandaredDeductionGold'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionGold' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionGold' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private GEPStandaredDeductionGold: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPStandaredDeductionSilver'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionSilver' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPStandaredDeductionSilver' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private GEPStandaredDeductionSilver: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GEPStandaredDeductionPlatinum'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GEPPureGoldPurity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private GEPStandaredDeductionPlatinum: string;

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
  private enableGEPSale: { id: string; name: string; checked?: boolean }[];
  constructor(
    id: number,
    GEPPureGoldPurity: string,
    GEPPureSilverPurity: string,
    GEPPurePlatinumPurity: string,
    GEPStandaredDeductionGold: string,
    GEPStandaredDeductionSilver: string,
    GEPStandaredDeductionPlatinum: string,
    enableGEPSale: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.GEPPureGoldPurity = GEPPureGoldPurity;
    this.GEPPureSilverPurity = GEPPureSilverPurity;
    this.GEPPurePlatinumPurity = GEPPurePlatinumPurity;
    this.GEPStandaredDeductionGold = GEPStandaredDeductionGold;
    this.GEPStandaredDeductionSilver = GEPStandaredDeductionSilver;
    this.GEPStandaredDeductionPlatinum = GEPStandaredDeductionPlatinum;
    this.enableGEPSale = enableGEPSale;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
