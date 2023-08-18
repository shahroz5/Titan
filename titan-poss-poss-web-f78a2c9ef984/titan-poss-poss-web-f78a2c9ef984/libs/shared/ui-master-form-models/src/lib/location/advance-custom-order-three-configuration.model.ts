
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

export class AdvanceCustomOrderConfigurationStepThree extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDaysforAutoClosureInAdvanceBooking: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforActivateInAdvanceBooking'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInAdvanceBooking'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInAdvanceBooking'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDaysforActivateInAdvanceBooking: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforReleaseInvInAdvancebooking'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforReleaseInvInAdvancebooking'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforReleaseInvInAdvancebooking'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDaysforReleaseInvInAdvancebooking: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforAutoClosureInCustomerOrder'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDaysforAutoClosureInCustomerOrder: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforActivateInCustomerOrder'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInCustomerOrder'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInCustomerOrder'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validityDaysforActivateInCustomerOrder: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validitydaysforReleaseInvInCustomerOrder'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.validitydaysforReleaseInvInCustomerOrder'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.validitydaysforReleaseInvInCustomerOrder'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private validitydaysforReleaseInvInCustomerOrder: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.goldRateAttempts'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.goldRateAttempts' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.goldRateAttempts' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private goldRateAttempts: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.manualBillWeightDeviation'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.locationMaster.manualBillWeightDeviation' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.manualBillWeightDeviation' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private manualBillWeightDeviation: string;

  constructor(
    id: number,
    validityDaysforAutoClosureInAdvanceBooking: string,
    validityDaysforActivateInAdvanceBooking: string,
    validityDaysforReleaseInvInAdvancebooking: string,
    validityDaysforAutoClosureInCustomerOrder: string,
    validityDaysforActivateInCustomerOrder: string,
    validitydaysforReleaseInvInCustomerOrder: string,
    goldRateAttempts: string,
    manualBillWeightDeviation: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;

    this.validityDaysforAutoClosureInAdvanceBooking = validityDaysforAutoClosureInAdvanceBooking;
    this.validityDaysforActivateInAdvanceBooking = validityDaysforActivateInAdvanceBooking;
    this.validityDaysforReleaseInvInAdvancebooking = validityDaysforReleaseInvInAdvancebooking;
    this.validityDaysforAutoClosureInCustomerOrder = validityDaysforAutoClosureInCustomerOrder;
    this.validityDaysforActivateInCustomerOrder = validityDaysforActivateInCustomerOrder;
    this.validitydaysforReleaseInvInCustomerOrder = validitydaysforReleaseInvInCustomerOrder;
    this.goldRateAttempts = goldRateAttempts;
    this.manualBillWeightDeviation = manualBillWeightDeviation;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
