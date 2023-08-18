import { CFAProductCodeDetails } from './cfa-product-code-details.model';
import { CFAProductCodeCheckItOuts } from './cfa-product-code-checkitout.model';
import {
  FormField,
  DynamicFormFieldsBuilder,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';

export class CFAProductCodeMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.CFAProduct.productGroup',
    hide: false
  })
  private CFAProductCodeDetails: CFAProductCodeDetails;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.CFAProduct.productGroup',
    hide: false
  })
  private CFAProductCodeCheckItOuts: CFAProductCodeCheckItOuts;
  constructor(
    id: number,
    CFAProductDetails: CFAProductCodeDetails,
    CFAProductCodeCheckIts: CFAProductCodeCheckItOuts
  ) {
    super();
    this.id = id;
    this.CFAProductCodeDetails = CFAProductDetails;
    this.CFAProductCodeCheckItOuts = CFAProductCodeCheckIts;
  }
}
