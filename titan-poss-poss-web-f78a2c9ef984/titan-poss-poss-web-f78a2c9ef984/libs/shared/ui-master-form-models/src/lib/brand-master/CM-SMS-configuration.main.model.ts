import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,

} from '@poss-web/shared/components/ui-dynamic-form';
import { CMSMSConfigurationModel } from './CM-SMS-configuration-one.model';

export class CMSMSConfigurationMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.CMSMSConfigurationModel',
    hide: false
  })
  private CMSMSConfigurationModel: CMSMSConfigurationModel;

  constructor(id: number, cmsmsConfigurationModel: CMSMSConfigurationModel) {
    super();
    this.id = id;
    this.CMSMSConfigurationModel = cmsmsConfigurationModel;
  }
}
