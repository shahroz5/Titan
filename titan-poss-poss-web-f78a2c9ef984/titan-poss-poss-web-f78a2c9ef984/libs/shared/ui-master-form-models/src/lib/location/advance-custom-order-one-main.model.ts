import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';

import { Foc } from './advance-custom-order-one-foc.model';
import { Rtgs } from './advance-custom-order-one-rtgs.model';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
export class AdvanceCustomOrderMainStepOne extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.foc',
    hide: false
  })
  private foc: Foc;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.rtgs',
    hide: false
  })
  private rtgs: Rtgs;

  constructor(id: number, foc: Foc, rtgs: Rtgs, fieldValidatorsService: FieldValidatorsService, translateService: TranslateService) {
    super();
    this.id = id;
    this.foc = foc;
    this.rtgs = rtgs;

    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}


