import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';

import { GHSDayDetailsModelCreditNoteConfig } from './ghs-one-daydetails.model';

import { GHSDayDetailsModelValidityConfig } from './ghs-one-daydetails1.model';

export class GHSMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.creditNoteConfig',
    hide: false
  })
  private dayDetails1: GHSDayDetailsModelCreditNoteConfig;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.validityConfig',
    hide: false
  })
  private dayDetails2: GHSDayDetailsModelValidityConfig;
  constructor(
    id: number,
    dayDetails1: GHSDayDetailsModelCreditNoteConfig,
    dayDetails2: GHSDayDetailsModelValidityConfig
  ) {
    super();
    this.id = id;
    this.dayDetails1 = dayDetails1;
    this.dayDetails2 = dayDetails2;
  }
}
