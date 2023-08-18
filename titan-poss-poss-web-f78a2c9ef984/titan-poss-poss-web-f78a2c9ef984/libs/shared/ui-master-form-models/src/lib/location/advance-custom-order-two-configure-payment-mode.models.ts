import { Validators } from '@angular/forms';

import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';

import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
export class ConfigurePaymentMode extends DynamicFormFieldsBuilder {
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
  private configurePaymentModeCheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.paymentCode'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.paymentCodeField,
        options: { fieldKey: 'pw.locationMaster.paymentCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.paymentCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.paymentCodeField
  })
  private paymentCode: string;

  constructor(
    id: number,
    configurePaymentModeCheckBoxes: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    paymentCode: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.configurePaymentModeCheckBoxes = configurePaymentModeCheckBoxes;
    this.paymentCode = paymentCode;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
