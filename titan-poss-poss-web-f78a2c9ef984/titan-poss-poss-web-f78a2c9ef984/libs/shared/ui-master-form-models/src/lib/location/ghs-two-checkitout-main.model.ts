import { GHSCheckItOutModel } from './ghs-two-checkitout.model';

import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';

export class CheckItOutMain2 extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.ghsConfig',
    hide: false
  })
  private ghs: GHSCheckItOutModel;
  constructor(id: number, ghs: GHSCheckItOutModel) {
    super();
    this.id = id;
    this.ghs = ghs;
  }
}
