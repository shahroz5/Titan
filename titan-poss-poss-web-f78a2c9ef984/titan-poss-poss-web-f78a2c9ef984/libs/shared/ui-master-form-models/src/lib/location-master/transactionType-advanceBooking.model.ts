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

export class TransactionTypeAdvanceBookingModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
        }
      }
    ]
  })
  private daysAutoClosure: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforActivateInAdvanceBooking'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInAdvanceBooking'
        }
      }
    ]
  })
  private daysForActivate: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforReleaseInvInAdvancebooking'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforReleaseInvInAdvancebooking'
        }
      }
    ]
  })
  private daysForRelease: string;

  /* 
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.minPercentToBePaidForFrozenOrder'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: {
          fieldKey: 'pw.locationMaster.minPercentToBePaidForFrozenOrder'
        }
      }
    ]
  })
  private minPercentToBePaidForFrozenOrder: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.minPercentToBePaidForNonFrozenOrder'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: {
          fieldKey: 'pw.locationMaster.minPercentToBePaidForNonFrozenOrder'
        }
      }
    ]
  })
  private minPercentToBePaidForNonFrozenOrder: string;
 */

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.abHoldTime'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.abHoldTime' }
      }
    ]
  })
  private abHoldTime: string;

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
  private advanceBookingCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.numberOfHoursForOpenTaskDeletion'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: {
          fieldKey: 'pw.locationMaster.numberOfHoursForOpenTaskDeletion'
        }
      }
    ]
  })
  private numberOfHoursForOpenTaskDeletion: string;

  // minPercentToBePaidForFrozenOrder: string,
  // minPercentToBePaidForNonFrozenOrder: string,

  // this.minPercentToBePaidForFrozenOrder = minPercentToBePaidForFrozenOrder;
  // this.minPercentToBePaidForNonFrozenOrder = minPercentToBePaidForNonFrozenOrder;
  constructor(
    id: number,
    daysAutoClosure: string,
    daysForActivate: string,
    daysForRelease: string,
    abHoldTime: string,
    advanceBookingCheckbox: { id: string; name: string; checked?: boolean }[],
    numberOfHoursForOpenTaskDeletion: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.daysAutoClosure = daysAutoClosure;
    this.daysForActivate = daysForActivate;
    this.abHoldTime = abHoldTime;
    this.daysForRelease = daysForRelease;
    this.advanceBookingCheckbox = advanceBookingCheckbox;
    this.numberOfHoursForOpenTaskDeletion = numberOfHoursForOpenTaskDeletion;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
