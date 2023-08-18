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

export class BrandOne extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.brandCode'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.brandCodeField,
        options: { fieldKey: 'pw.brandMaster.brandCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.brandCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.brandCodeField
  })
  private brandCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.brandName'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.brandMaster.brandName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.brandName' }
      }
    ]
  })
  private brandName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.brandShortName'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.brandMaster.brandShortName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.brandShortName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.alphabetsField
  })
  private brandShortName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.cashRefundLimit'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.cashRefundLimit' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.cashRefundLimit' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private cashRefundLimit: string;

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
  private brandCheckBox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  constructor(
    id: number,
    brandCode: string,
    brandName: string,
    brandShortName: string,
    cashRefundLimit: string,
    brandCheckbox: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.brandCode = brandCode;
    this.brandName = brandName;
    this.brandShortName = brandShortName;
    this.cashRefundLimit = cashRefundLimit;
    this.brandCheckBox = brandCheckbox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
