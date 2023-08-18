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

export class TransactionTypeCustomerOrderModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforAutoClosureInCustomerOrder'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey:
            'pw.locationMaster.validityDaysforAutoClosureInCustomerOrder'
        }
      }
    ]
  })
  private daysForAutoClosure: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.validityDaysforActivateInCustomerOrder'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.validityDaysforActivateInCustomerOrder'
        }
      }
    ]
  })
  private daysForActivate: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysForAutoApproval'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysForAutoApproval' }
      }
    ]
  })
  private daysForAutoApproval: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysForReturnAutoApproval'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.noOfDaysForReturnAutoApproval' }
      }
    ]
  })
  private daysForReturnAutoApproval: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.coHoldTime'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.coHoldTime' }
      }
    ]
  })
  private coHoldTime: string;

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
  private customerOrderCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    daysForAutoClosure: string,
    daysForActivate: string,
    daysForAutoApproval: string,
    daysForReturnAutoApproval: string,
    coHoldTime: string,
    customerOrderCheckbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.daysForAutoClosure = daysForAutoClosure;
    this.daysForActivate = daysForActivate;
    this.daysForAutoApproval = daysForAutoApproval;
    this.daysForReturnAutoApproval = daysForReturnAutoApproval;
    this.coHoldTime = coHoldTime;
    this.customerOrderCheckbox = customerOrderCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
