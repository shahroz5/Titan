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

export class TransactionTypeCashMemoModel extends DynamicFormFieldsBuilder {
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
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private titlePrintCustomerTransactionCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

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
  private transactionTypeCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.cmHoldTimeInMinutes'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: {
          fieldKey: 'pw.locationMaster.cmHoldTimeInMinutes'
        }
      }
    ]
  })
  private cmHoldTimeInMinutes: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfHoursForOpenTaskDeletionCM'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: {
          fieldKey: 'pw.locationMaster.noOfHoursForOpenTaskDeletionCM'
        }
      }
    ]
  })
  private noOfHoursForOpenTaskDeletionCM: string;

  constructor(
    id: number,
    titlePrintCustomerTransactionCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    transactionTypeCheckbox: { id: string; name: string; checked?: boolean }[],
    cmHoldTimeInMinutes: string,
    noOfHoursForOpenTaskDeletionCM: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.titlePrintCustomerTransactionCheckbox = titlePrintCustomerTransactionCheckbox;
    this.transactionTypeCheckbox = transactionTypeCheckbox;
    this.cmHoldTimeInMinutes = cmHoldTimeInMinutes;
    this.noOfHoursForOpenTaskDeletionCM = noOfHoursForOpenTaskDeletionCM;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
