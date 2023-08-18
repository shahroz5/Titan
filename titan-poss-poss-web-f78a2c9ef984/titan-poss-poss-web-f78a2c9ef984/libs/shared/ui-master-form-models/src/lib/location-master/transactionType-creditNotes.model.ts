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

export class TransactionTypeCreditNotesModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfDaysForSuspendingCreditNotes'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.noOfDaysForSuspendingCreditNotes'
        }
      }
    ]
  })
  private daysSuspendingCreditNotes: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.suspendingtransferredcreditnotes'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.suspendingtransferredcreditnotes'
        }
      }
    ]
  })
  private daysSuspendingTransferredCreditNotes: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.suspendinggracepcreditnotes'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.suspendinggracepcreditnotes' }
      }
    ]
  })
  private suspensionGradeCreditNotes: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.MaxNoofCN'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.MaxNoofCN' }
      }
    ]
  })
  private maxCN: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.MinimumOTPCNvalue'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.MinimumOTPCNvalue' }
      }
    ]
  })
  private minimumOTPCN: string;

  // @FormField({
  //     fieldType: FormFieldType.TEXT,
  //     label: 'pw.locationMaster.MaxnumbereGHS'
  // })
  // @Class({ className: [] })
  // @Validation({
  //     customValidators: [
  //         {
  //             name: PossWebFieldValidators.numbersField,
  //             options: { fieldKey: 'pw.locationMaster.MaxnumbereGHS' }
  //         }
  //     ]
  // })
  // private maxNoEGHSCredit: string;

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
  private employeeLoanCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    daysSuspendingCreditNotes: string,
    daysSuspendingTransferredCreditNotes: string,
    suspensionGradeCreditNotes: string,
    maxCN: string,
    minimumOTPCN: string,
    // maxNoEGHSCredit: string,
    employeeLoanCheckbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.daysSuspendingCreditNotes = daysSuspendingCreditNotes;
    this.daysSuspendingTransferredCreditNotes = daysSuspendingTransferredCreditNotes;
    this.suspensionGradeCreditNotes = suspensionGradeCreditNotes;
    this.maxCN = maxCN;
    this.minimumOTPCN = minimumOTPCN;
    // this.maxNoEGHSCredit = maxNoEGHSCredit;
    this.employeeLoanCheckbox = employeeLoanCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
