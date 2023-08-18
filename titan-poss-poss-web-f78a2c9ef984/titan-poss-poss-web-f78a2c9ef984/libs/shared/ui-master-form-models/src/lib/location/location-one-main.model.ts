import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { LocationModel } from './location-one-details.model';
import { PersonalModel } from './location-one-address.model';

export class LocationMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.locationDetails',
    hide: false
  })
  private location: LocationModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.AddressDetails',
    hide: false
  })
  private personal: PersonalModel;

  constructor(id: number, location: LocationModel, personal: PersonalModel) {
    super();
    this.id = id;
    this.location = location;
    this.personal = personal;
  }
}
