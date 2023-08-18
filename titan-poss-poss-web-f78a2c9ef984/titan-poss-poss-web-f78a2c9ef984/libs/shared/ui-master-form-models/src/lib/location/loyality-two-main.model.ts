import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { EmployeeDiscount } from './loyality-two-employee-discount.model';
import { Ccpayment } from './loyality-two-ccpayment.model';
import { GiftCardConfiguration } from './loyality-two-giftconfiguration.model';

export class Loyality2Main extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.employeeDiscount',
    hide: false
  })
  private employeeDiscount: EmployeeDiscount;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.ccPayment',
    hide: false
  })
  private ccpayment: Ccpayment;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.giftCardConfiguration',
    hide: false
  })
  private giftCardConfiguration: GiftCardConfiguration;

  constructor(
    id: number,
    ccpayment: Ccpayment,
    giftCardConfiguration: GiftCardConfiguration,
    employeeDiscount: EmployeeDiscount
  ) {
    super();
    this.id = id;
    this.employeeDiscount = employeeDiscount;
    this.giftCardConfiguration = giftCardConfiguration;
    this.ccpayment = ccpayment;
  }
}
