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

export class PaymentMasterModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'pw.paymentMaster.selectType'
  })
  @Class({ className: ['col-12'] })
  private type: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.paymentMaster.paymentCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.paymentCodeField,
        options: { fieldKey: 'pw.paymentMaster.paymentCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.paymentMaster.paymentCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.paymentCodeField
  })
  @Class({ className: ['col-12'] })
  private paymentCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.paymentMaster.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.paymentMaster.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.paymentMaster.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.paymentMaster.referenceOne'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.referenceIdField,
        options: { fieldKey: 'pw.paymentMaster.referenceOne' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.paymentMaster.referenceOne' }
      }
    ],
    inputConstraint: PossWebFieldValidators.referenceIdField
  })
  @Class({ className: ['col-12'] })
  private referenceOne: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.paymentMaster.referenceTwo'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.referenceIdField,
        options: { fieldKey: 'pw.paymentMaster.referenceTwo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.referenceIdField
  })
  @Class({ className: ['col-12'] })
  private referenceTwo: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.paymentMaster.referenceThree'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.referenceIdField,
        options: { fieldKey: 'pw.paymentMaster.referenceThree' }
      }
    ],
    inputConstraint: PossWebFieldValidators.referenceIdField
  })
  @Class({ className: ['col-12'] })
  private referenceThree: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12', 'pl-0'] })
  private customerDependent: { id: string; name: string; checked: boolean }[];
  constructor(
    id: number,
    type: { id: string; name: string; checked: boolean }[],
    paymentCode: string,
    description: string,
    referenceOne: string,
    referenceTwo: string,
    referenceThree: string,

    customerDependent: { id: string; name: string; checked: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.type = type;
    this.paymentCode = paymentCode;
    this.description = description;
    this.referenceOne = referenceOne;
    this.referenceTwo = referenceTwo;
    this.referenceThree = referenceThree;
    this.customerDependent = customerDependent;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
