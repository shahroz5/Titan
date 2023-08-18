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

export class TransactionTypeGRNModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.daysGRNIsallowed'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.daysGRNIsallowed' }
      }
    ]
  })
  private daysGRNAllowed: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.daysforapprovedGRN'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.daysforapprovedGRN' }
      }
    ]
  })
  private daysGRNApproved: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.protectgoldrateforGRN'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.protectgoldrateforGRN' }
      }
    ]
  })
  private protectGoldRate: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.MinimumutilizationforGRN'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.MinimumutilizationforGRN' }
      }
    ]
  })
  private minimumUtilization: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private innerBoutiqueGRNAllowed: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    daysGRNAllowed: string,
    daysGRNApproved: string,
    protectGoldRate: string,
    minimumUtilization: string,
    innerBoutiqueGRNAllowed: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.daysGRNAllowed = daysGRNAllowed;
    this.daysGRNApproved = daysGRNApproved;
    this.protectGoldRate = protectGoldRate;
    this.minimumUtilization = minimumUtilization;
    this.innerBoutiqueGRNAllowed = innerBoutiqueGRNAllowed;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
