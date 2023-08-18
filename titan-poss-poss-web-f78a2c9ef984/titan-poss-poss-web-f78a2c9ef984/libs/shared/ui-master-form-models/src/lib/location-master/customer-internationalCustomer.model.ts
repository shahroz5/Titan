import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class CustomerInternationalCustomerModel extends DynamicFormFieldsBuilder {
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
  private customerInternationalCustomerCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    customerInternationalCustomerCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.customerInternationalCustomerCheckbox = customerInternationalCustomerCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
