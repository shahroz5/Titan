import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { ChecksModel } from './location-two-checks.model';
import { Checks2Model } from './print-one-checkitout2';

export class CheckMainModel extends DynamicFormFieldsBuilder {


private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.printConfig',
        hide: false
    })
    private checks1: ChecksModel;
    @FormField({
      fieldType: FormFieldType.SUB_FORM,
      label: 'pw.locationMaster.printConfig',
      hide: false
  })
  private check2: Checks2Model;
    constructor(
      id: number,
      checks1:ChecksModel,
      checks2:Checks2Model

  ) {
      super();
      this.id = id;
      this.checks1=checks1;
      this.check2=checks2;

  }
  }
