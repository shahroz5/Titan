import {
  Class,
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { CustomerKycModel } from './customer-kyc.model';
import { CustomerEncircleModel } from './customer-encircle.model';
import { CustomerInstitutionalCustomerLMModel } from './customer-InstitutionalCustomerLM.model';
import { CustomerInternationalCustomerModel } from './customer-internationalCustomer.model';
import { CustomerOneTimeCustomerModel } from './customer-OneTimeCustomer.model';

export class CustomerMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.customerKyc',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private customerKycModel: CustomerKycModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.EncircleCustomer',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-1-column'] })
  private customerEncircleModel: CustomerEncircleModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.OnetimeCustomer',
    hide: false
  })
  private customerOneTimeCustomerModel: CustomerOneTimeCustomerModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.InstitutionalCustomer',
    hide: false
  })
  private customerInstitutionalCustomerModel: CustomerInstitutionalCustomerLMModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.InternationalCustomer',
    hide: false
  })
  private customerInternationalCustomerModel: CustomerInternationalCustomerModel;

  constructor(
    id: number,
    customerKycModel: CustomerKycModel,
    customerEncircleModel: CustomerEncircleModel,
    customerOneTimeCustomerModel: CustomerOneTimeCustomerModel,
    customerInstitutionalCustomerModel: CustomerInstitutionalCustomerLMModel,
    customerInternationalCustomerModel: CustomerInternationalCustomerModel
  ) {
    super();
    this.id = id;
    this.customerKycModel = customerKycModel;
    this.customerEncircleModel = customerEncircleModel;
    this.customerOneTimeCustomerModel = customerOneTimeCustomerModel;
    this.customerInternationalCustomerModel = customerInternationalCustomerModel;
    this.customerInstitutionalCustomerModel = customerInstitutionalCustomerModel;
  }
}
