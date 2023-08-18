import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { TcsDetailsModel } from './tcs-details.model';

export class TcsMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: '',
    hide: false
  })
  private tcsDetailsModel: TcsDetailsModel;

  constructor(id: number, tcsDetailsModel: TcsDetailsModel) {
    super();
    this.id = id;
    this.tcsDetailsModel = tcsDetailsModel;
  }
}
