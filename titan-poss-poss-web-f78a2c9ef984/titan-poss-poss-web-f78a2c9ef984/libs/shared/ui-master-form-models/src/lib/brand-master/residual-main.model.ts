import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,

} from '@poss-web/shared/components/ui-dynamic-form';

import { ResidualAmountModel } from './residual-one.models';

export class ResidualAmountMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.residualAmountModel',
    hide: false
  })
  private residualAmountModel: ResidualAmountModel;

  constructor(id: number, residualAmountModel: ResidualAmountModel) {
    super();
    this.id = id;
    this.residualAmountModel = residualAmountModel;
  }
}
