import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { CustomerConfigModel } from './new_customer_config.model';

export class CustomerConfigFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: '',
    hide: false
  })
  private customerConfigModel: CustomerConfigModel;

  constructor(id: number, customerConfigModel: CustomerConfigModel) {
    super();
    this.id = id;
    this.customerConfigModel = customerConfigModel;
  }
}
