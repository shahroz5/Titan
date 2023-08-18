import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { RemarksModel } from './loaction-third-remarks.model';


export class ThirdDetailsMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.remarks',
    hide: false
  })
  private remarks: RemarksModel;

  constructor(id: number,  remarks: RemarksModel) {
    super();
    this.id = id;
    this.remarks = remarks;
  }
}
