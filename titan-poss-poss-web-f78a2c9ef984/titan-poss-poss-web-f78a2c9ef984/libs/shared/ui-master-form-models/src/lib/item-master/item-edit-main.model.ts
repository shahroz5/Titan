
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
} from '@poss-web/shared/components/ui-dynamic-form';


import { ItemModelEditPartOne } from './item-edit-one-details.model';
import { ItemModelEditPartTwo } from './item-edit-two-details.model';

export class ItemEditMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.itemMaster.itemMasterSubFormLabel',
    hide: false
  })
  private itemPartOne: ItemModelEditPartOne;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.itemMaster.itemMasterSubFormLabel',
    hide: false
  })
  private itemPartTwo: ItemModelEditPartTwo;

  constructor(
    id: number,
    itemPartOne: ItemModelEditPartOne,
    itemPartTwo: ItemModelEditPartTwo
  ) {
    super();
    this.id = id;
    this.itemPartOne = itemPartOne;
    this.itemPartTwo = itemPartTwo;
  }
}
