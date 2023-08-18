import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
} from '@poss-web/shared/components/ui-dynamic-form';

import { ItemModelViewPartOne } from './item-view-one-details.model';
import { ItemModelViewPartTwo } from './item-view-two-details.model';

export class ItemViewMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.itemMaster.itemMasterSubFormLabel',
    hide: false
  })
  private itemPartOne: ItemModelViewPartOne;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.itemMaster.itemMasterSubFormLabel',
    hide: false
  })
  private itemPartTwo: ItemModelViewPartTwo;

  constructor(
    id: number,
    itemPartOne: ItemModelViewPartOne,
    itemPartTwo: ItemModelViewPartTwo
  ) {
    super();
    this.id = id;
    this.itemPartOne = itemPartOne;
    this.itemPartTwo = itemPartTwo;
  }
}
