import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { Loyality } from './loyality-one-model';
import { Gvpayment } from './loyality-one-gvpayment.model';
import { PersonalDetails } from './loyality-one-personaldetails';


export class LoyalityMain extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.loyality',
    hide: false
  })
  private loyality: Loyality;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.GVPayment',
    hide: false
  })
  private gvPayment: Gvpayment;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.loyalityDetails',
    hide: false
  })
  private personalDetails: PersonalDetails;
  constructor(
    id: number,
    loyality: Loyality,
    gvPayment: Gvpayment,
    personalDetails: PersonalDetails
  ) {
    super();
    this.id = id;
    this.loyality = loyality;
    this.personalDetails = personalDetails;
    this.gvPayment = gvPayment;
  }
}
