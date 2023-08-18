import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { Tep } from './loyality-three-tep.model';


export class Loyality3Model extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.tep',
    hide: false
  })
  private tep: Tep;
  constructor(id: number, tep: Tep) {
    super();
    this.id = id;
    this.tep = tep;
  }
}
