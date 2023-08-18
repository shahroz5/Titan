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

export class OtherModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.regdOffice'
  })
  @Class({ className: ['col-12'] })
  private regdOffice: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.CINNumber'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.CINNumber_pattern' }]
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.cinNumberField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.countryMaster.countryName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cinNumberField
  })

  // @Validation({ validators: [Validators.required, Validators.pattern('^[0-9A-Za-z]*$')] })
  private CINNumber: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.corporateAddress'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.addressField,
        options: { fieldKey: 'pw.locationMaster.corporateAddress' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.corporateAddress' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  private corporateAddress: string;

  // @FormField({
  //   fieldType: FormFieldType.SELECT,
  //   selectOptionKeys: { labelKey: 'name', valueKey: 'id', selectedKey: 'selected' }, label: 'payment Mode For Refund  '
  // })
  // @Validation({ validators: [Validators.required] })
  // private paymentModeForRefund: string;

  constructor(
    id: number,
    regdOffice: string,
    CINNumber: string,
    corporateAddress: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.regdOffice = regdOffice;
    this.CINNumber = CINNumber;
    this.corporateAddress = corporateAddress;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
