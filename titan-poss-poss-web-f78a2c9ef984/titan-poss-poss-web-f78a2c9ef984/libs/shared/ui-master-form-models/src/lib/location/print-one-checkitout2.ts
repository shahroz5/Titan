import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';

export class Checks2Model extends DynamicFormFieldsBuilder {
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
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.freeTextForGrams'
  })
  @Class({ className: ['col-12'] })
  private freeTextForGrams: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.noOfInvoiceCopies'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.invoiceDigits' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.pattern('^[0-9]*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.noOfInvoiceCopies' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private noOfInvoicecopiesforRegularOrQuickCM: number;

  constructor(
    id: number,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    freeTextForGrams: string,
    noOfInvoicecopiesforRegularOrQuickCM: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.checkBoxes = checkBoxes;
    this.freeTextForGrams = freeTextForGrams;
    this.noOfInvoicecopiesforRegularOrQuickCM = noOfInvoicecopiesforRegularOrQuickCM;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
