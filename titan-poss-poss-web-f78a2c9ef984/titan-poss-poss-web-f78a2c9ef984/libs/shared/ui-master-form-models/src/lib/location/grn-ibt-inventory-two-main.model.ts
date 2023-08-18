import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { IBTConfiguration } from './grn-ibt-inventory-two-configuration.model';
import { GrnIbtInventoryKYCConfiguration } from './grn-ibt-inventory-two-kyc-configuration.model';
import { GrnIbtULPConfigurationtwo } from './grn-ibt-inventory-two-ulp-configuartion.model';

export class GrnIBT2Main extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.IBTConfiguration',
    hide: false
  })
  private IBTConfiguration: IBTConfiguration;

  // @FormField({
  //   fieldType: FormFieldType.SUB_FORM,
  //   label: 'pw.locationMaster.inventory',
  //   hide: false
  // })
  // private inventory: InventoryConfiguration;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.KYCConfiguration',
    hide: false
  })
  private KYCConfiguration: GrnIbtInventoryKYCConfiguration;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.ULPConfiguration',
    hide: false
  })
  private ULPConfiguration: GrnIbtULPConfigurationtwo;
  constructor(
    id: number,
    IBTConfig: IBTConfiguration,
    // inventory: InventoryConfiguration,
    KYCConfig: GrnIbtInventoryKYCConfiguration,
    ULPConfig: GrnIbtULPConfigurationtwo
  ) {
    super();
    this.id = id;
    this.IBTConfiguration = IBTConfig;
    // this.inventory = inventory;
    this.KYCConfiguration = KYCConfig;
    this.ULPConfiguration = ULPConfig;
  }
}
