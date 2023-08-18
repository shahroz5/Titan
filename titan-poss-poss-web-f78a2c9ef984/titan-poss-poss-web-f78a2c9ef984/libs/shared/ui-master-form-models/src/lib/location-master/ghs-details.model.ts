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

export class GhsFormDetailsModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.suspendingGhs'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.suspendingGhs' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.suspendingGhs' }
      }
    ]
  })
  private daysSuspendingGHS: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.graceSuspendingGhs'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.graceSuspendingGhs' }
      }
    ]
  })
  private gracePeriod: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.GHSRevenueConsolidate'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.GHSRevenueConsolidate' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.GHSRevenueConsolidate' }
      }
    ]
  })
  private MaxGHSRevenue: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysToBlockCustomerOrder'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysToBlockCustomerOrder' }
      }
    ]
  })
  private daysToBlockCustomerOrder: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysToBlockInAdvanceBooking'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.noOfDaysToBlockInAdvanceBooking'
        }
      }
    ]
  })
  private daysToBlockAdvanceBooking: string;

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
  private ghsDetailsCheckbox: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    daysSuspendingGHS: string,
    gracePeriod: string,
    MaxGHSRevenue: string,
    daysToBlockCustomerOrder: string,
    daysToBlockAdvanceBooking: string,
    ghsDetailsCheckbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.daysSuspendingGHS = daysSuspendingGHS;
    this.gracePeriod = gracePeriod;
    this.MaxGHSRevenue = MaxGHSRevenue;
    this.daysToBlockCustomerOrder = daysToBlockCustomerOrder;
    this.daysToBlockAdvanceBooking = daysToBlockAdvanceBooking;
    this.ghsDetailsCheckbox = ghsDetailsCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
