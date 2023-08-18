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

export class BankingDetailsModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.REFRESH_SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.paymentModeForRefund'
  })
  @Class({ className: ['row'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.paymentModeForRefund' }
      }
    ]
  })
  private bankingDetailsSelect: {
    id: string;
    name: string;
    selected?: boolean;
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
  private bankingDetailsCheckbox1: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.SAPCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.alphaNumericField,
        options: { fieldKey: 'pw.locationMaster.SAPCode' }
      }
    ]
  })
  private sapCode: string;

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
  private bankingDetailsCheckbox2: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.remarksForPassword'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.remarkField,
        options: { fieldKey: 'pw.locationMaster.remarksForPassword' }
      }
    ]
  })
  private remarkForPassword: string;

  constructor(
    id: number,
    bankingDetailsSelect: { id: string; name: string; selected?: boolean }[],
    bankingDetailsCheckbox1: { id: string; name: string; checked?: boolean }[],
    sapCode: string,
    bankingDetailsCheckbox2: { id: string; name: string; checked?: boolean }[],
    remarkForPassword: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.bankingDetailsSelect = bankingDetailsSelect;
    this.bankingDetailsCheckbox1 = bankingDetailsCheckbox1;
    this.sapCode = sapCode;
    this.bankingDetailsCheckbox2 = bankingDetailsCheckbox2;
    this.remarkForPassword = remarkForPassword;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
