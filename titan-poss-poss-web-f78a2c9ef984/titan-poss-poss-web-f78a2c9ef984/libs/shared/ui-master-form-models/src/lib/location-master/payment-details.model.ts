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

export class PaymentDetailsModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDays'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.validityDays' }
      }
    ]
  })
  private chequeValidity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.ddValidity'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.ddValidity' }
      }
    ]
  })
  private ddValidity: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.realisationDays'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.realisationDays' }
      }
    ]
  })
  private chequeRealization: string;

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
  private paymentDetailsCheckbox1: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.ROApprovedPayment'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.ROApprovedPayment' }
      }
    ]
  })
  private roPayment: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.RORequestDeletion'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.RORequestDeletion' }
      }
    ]
  })
  private roDeletion: string;

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
  private paymentDetailsCheckbox2: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.rtgsmaximumAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.rtgsmaximumAmount' }
      }
    ]
  })
  private maxAmount: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.locationMaster.rtgsminimumAmount'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.locationMaster.rtgsminimumAmount' }
      }
    ]
  })
  private minAmount: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysForChequeDDAcceptance'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: []
  })
  private chequeDDDate: string;

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
  private paymentDetailsCheckbox3: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    chequeValidity: string,
    ddValidity: string,
    chequeRealization: string,
    paymentDetailsCheckbox1: { id: string; name: string; selected?: boolean }[],
    roPayment: string,
    roDeletion: string,
    paymentDetailsCheckbox2: { id: string; name: string; checked?: boolean }[],
    maxAmount: string,
    minAmount: string,
    chequeDDDate: string,
    paymentDetailsCheckbox3: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.chequeValidity = chequeValidity;
    this.ddValidity = ddValidity;
    this.chequeRealization = chequeRealization;
    this.paymentDetailsCheckbox1 = paymentDetailsCheckbox1;
    this.roPayment = roPayment;
    this.roDeletion = roDeletion;
    this.paymentDetailsCheckbox2 = paymentDetailsCheckbox2;
    this.maxAmount = maxAmount;
    this.minAmount = minAmount;
    this.chequeDDDate = chequeDDDate;
    this.paymentDetailsCheckbox3 = paymentDetailsCheckbox3;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
