import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

export class CurrencyModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.brandMaster.inventoryCurrency'
  })
  @Class({ className: ['col-12'] })
  private inventoryCurrency: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.brandMaster.STNCurrency'
  })
  @Class({ className: ['col-12'] })
  private STNCurrency: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.brandMaster.masterCurrency'
  })
  @Class({ className: ['col-12'] })
  private masterCurrency: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private currencyCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  constructor(
    id: number,
    currencyCheckbox: { id: string; name: string; checked?: boolean }[],
    inventoryCurrency: string,
    STNCurrency: string,
    masterCurrency: string
  ) {
    super();
    this.id = id;
    this.currencyCheckbox = currencyCheckbox;
    this.inventoryCurrency = inventoryCurrency;
    this.STNCurrency = STNCurrency;
    this.masterCurrency = masterCurrency;
  }
}
