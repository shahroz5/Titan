import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { DigigoldDetailsModel } from './digigold-details.model';

export class DigigoldMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Digi Gold Details',
    hide: false
  })
  private digigoldDetailsModel: DigigoldDetailsModel;

  constructor(id: number, digigoldDetailsModel: DigigoldDetailsModel) {
    super();
    this.id = id;
    this.digigoldDetailsModel = digigoldDetailsModel;
  }
}
