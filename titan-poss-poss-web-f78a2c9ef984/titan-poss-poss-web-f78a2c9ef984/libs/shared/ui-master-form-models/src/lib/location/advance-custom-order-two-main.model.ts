import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';

import { CheckItOut } from './advance-custom-order-checkitout.model';
import { ConfigurePaymentMode } from './advance-custom-order-two-configure-payment-mode.models';
import { LocationPricegroupmapping } from './advance-custom-order-two-location-price-grouping.models';
import { TranslateService } from '@ngx-translate/core';
export class AdvanceCustomOrderMainStepTwo extends DynamicFormFieldsBuilder {
  private id: number;


  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.otpConfiguration'
  })
  private checkItOut: CheckItOut;


  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.configurePaymentMode'
  })
  private configurePaymentMode: ConfigurePaymentMode;



  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.locationPricegroupmapping'
  })
  private locationPricegroupmapping: LocationPricegroupmapping;


  constructor(id: number, checkitOut: CheckItOut, configurePaymentMode: ConfigurePaymentMode, locationPricegroupmapping:
    LocationPricegroupmapping, translateService: TranslateService) {
    super();
    this.id = id;
    this.checkItOut = checkitOut;
    this.configurePaymentMode = configurePaymentMode;
    this.locationPricegroupmapping = locationPricegroupmapping;

    this.TranslateService = translateService;
  }
}

