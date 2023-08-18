import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
} from '@poss-web/shared/components/ui-dynamic-form';

import { PanCardConfiguration } from './pancard-configuration-one.model';

export class PanCardConfigurationMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.panCardConfiguration',
    hide: false
  })
  private panCardConfiguration: PanCardConfiguration;



  constructor(id: number, panCardConfiguration: PanCardConfiguration) {
    super();
    this.id = id;
    this.panCardConfiguration = panCardConfiguration;

  }
}
