import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

export class GrnIbtInventoryKYCConfiguration extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({ validators: [] })
  @Class({ className: ['col-12 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];
  constructor(
    id: number,
    checkBoxes: { id: string; name: string; checked?: boolean }[]
  ) {
    super();
    this.id = id;
    this.checkBoxes = checkBoxes;
  }
}
