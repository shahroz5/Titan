import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { OtherModel } from './location-two-other.model';
import { ChecksModel } from './location-two-checks.model';

export class OtherDetailsMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.otherDetails',
    hide: false
  })
  private other: OtherModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.configurationDetails',
    hide: false
  })
  private checks: ChecksModel;

  constructor(id: number, other: OtherModel, checks: ChecksModel) {
    super();
    this.id = id;
    this.other = other;
    this.checks = checks;
  }
}
