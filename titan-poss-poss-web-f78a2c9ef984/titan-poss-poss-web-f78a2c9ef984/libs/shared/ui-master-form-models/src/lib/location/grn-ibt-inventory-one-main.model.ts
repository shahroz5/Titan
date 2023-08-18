import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { GRNConfiguration } from './grn-ibt-inventory-one-grnconfiguration';
import { GrnIbtInventoryOne } from './grn-ibt-inventory-one.model';
import { GrnIbtInventoryWalkIns } from './grn-ibt-inventory-one-walkins.model';


export class GrnInventoryMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.GRNConfiguration',
    hide: false
  })
  private GRNConfiguration: GRNConfiguration;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.inventory',
    hide: false
  })
  private inventory: GrnIbtInventoryOne;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.walkins',
    hide: false
  })
  private walkIns: GrnIbtInventoryWalkIns;

  constructor(
    id: number,
    grnConfiguration: GRNConfiguration,
    inventory: GrnIbtInventoryOne,
    walkIns: GrnIbtInventoryWalkIns
  ) {
    super();
    this.id = id;
    this.GRNConfiguration = grnConfiguration;
    this.inventory = inventory;
    this.walkIns = walkIns;
  }
}
