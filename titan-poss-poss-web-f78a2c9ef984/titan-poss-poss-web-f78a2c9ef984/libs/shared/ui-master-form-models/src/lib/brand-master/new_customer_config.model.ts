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

export class CustomerConfigModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.encircleCustomerMNSS'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.commaSaperatedNumberField,
        options: { fieldKey: 'pw.brandMaster.encircleCustomerMNSS' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.encircleCustomerMNSS' }
      }
    ]
  })
  private encircleCustomerMNSS: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.oneTimeCustomerMNSS'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.commaSaperatedNumberField,
        options: { fieldKey: 'pw.brandMaster.oneTimeCustomerMNSS' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.oneTimeCustomerMNSS' }
      }
    ]
  })
  private oneTimeCustomerMNSS: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.institutionalCustomerMNSS'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.commaSaperatedNumberField,
        options: { fieldKey: 'pw.brandMaster.institutionalCustomerMNSS' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.institutionalCustomerMNSS' }
      }
    ]
  })
  private institutionalCustomerMNSS: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.internationalCustomerMNSS'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.commaSaperatedNumberField,
        options: { fieldKey: 'pw.brandMaster.internationalCustomerMNSS' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.internationalCustomerMNSS' }
      }
    ]
  })
  private internationalCustomerMNSS: string;

  constructor(
    id: number,
    encircleCustomerMNSS: string,
    oneTimeCustomerMNSS: string,
    institutionalCustomerMNSS: string,
    internationalCustomerMNSS: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.encircleCustomerMNSS = encircleCustomerMNSS;
    this.oneTimeCustomerMNSS = oneTimeCustomerMNSS;
    this.institutionalCustomerMNSS = institutionalCustomerMNSS;
    this.internationalCustomerMNSS = internationalCustomerMNSS;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
