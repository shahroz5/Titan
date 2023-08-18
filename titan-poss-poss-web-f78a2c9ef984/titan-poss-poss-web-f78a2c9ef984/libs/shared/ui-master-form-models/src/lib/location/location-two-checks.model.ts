import { DynamicFormFieldsBuilder, FormField, FormFieldType, Class } from '@poss-web/shared/components/ui-dynamic-form';


export class ChecksModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked',
      foreignKey: 'foreignKey'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private locationcheckBoxes: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    locationcheckBoxes: {
      id: string;
      name: string;
      checked?: boolean;
      foreignKey?: string;
    }[]
  ) {
    super();
    this.id = id;
    this.locationcheckBoxes = locationcheckBoxes;
  }
}
