import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,

} from '@poss-web/shared/components/ui-dynamic-form';
import { CurrencyModel } from './currency-one.model';

export class CurrencyMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.currencyModel',
    hide: false
  })
  private currencyModel: CurrencyModel;

  constructor(id: number, currencyModel: CurrencyModel) {
    super();
    this.id = id;
    this.currencyModel = currencyModel;
  }
}
