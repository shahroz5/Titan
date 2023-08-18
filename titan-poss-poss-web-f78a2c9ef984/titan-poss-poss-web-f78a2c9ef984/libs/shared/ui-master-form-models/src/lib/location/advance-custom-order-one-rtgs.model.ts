import { Validators } from '@angular/forms';

import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class Rtgs extends DynamicFormFieldsBuilder {
  private id: number;

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
  private advanceCustomOrderTabOneRtgscheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.OTPHelpdeskEmailId',
    validationErrorMessages: [
      {
        errorType: 'pattern',
        errorMessage: 'pw.inventoryMasterValidation.OTPHelpdeskEmailId_pattern'
      }
    ]
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.emailField,
        options: { fieldKey: 'pw.locationMaster.OTPHelpdeskEmailId' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.OTPHelpdeskEmailId' }
      }
    ],
    inputConstraint: PossWebFieldValidators.emailField
  })
  private OTPHelpdeskEmailId: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxNoofCN'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.maxNoofCN' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.maxNoofCN' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private maxNoofCN: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.minOTPCNValue'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.minOTPCNValue' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.minOTPCNValue' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private minOTPCNValue: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxnoofdaysforPOlikelydate'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.maxnoofdaysforPOlikelydate' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.maxnoofdaysforPOlikelydate' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private maxnoofdaysforPOlikelydate: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.serviceTaxGSTRegistrationNumber',
    validationErrorMessages: [
      {
        errorType: 'pattern',
        errorMessage:
          'pw.inventoryMasterValidation.serviceTaxGSTRegistrationNumber_pattern'
      }
    ]
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.gstNumberField,
        options: {
          fieldKey: 'pw.locationMaster.serviceTaxGSTRegistrationNumber'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.serviceTaxGSTRegistrationNumber'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.gstNumberField
  })
  private serviceTaxGSTRegistrationNumber: string;

  constructor(
    id: number,
    checkBox: { id: string; name: string; checked?: boolean }[],
    minOTPCNValue: string,
    maxNoofCN: string,
    OTPHelpdeskEmailId: string,
    maxnoofdaysforPOlikelydate: string,
    serviceTaxGSTRegistrationNumber: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.advanceCustomOrderTabOneRtgscheckBoxes = checkBox;
    this.maxNoofCN = maxNoofCN;
    this.OTPHelpdeskEmailId = OTPHelpdeskEmailId;
    this.minOTPCNValue = minOTPCNValue;
    this.maxnoofdaysforPOlikelydate = maxnoofdaysforPOlikelydate;
    this.serviceTaxGSTRegistrationNumber = serviceTaxGSTRegistrationNumber;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
