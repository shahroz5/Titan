import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { BrandOne } from './brand-one.model';
import { BrandTwo } from './brand-two.model';

export class BrandMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.brandOne',
    hide: false
  })
  private brandOne: BrandOne;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.brandMaster.brandOne',
    hide: false
  })
  private brandTwo: BrandTwo;

  constructor(id: number, brandOne: BrandOne, brandTwo: BrandTwo) {
    super();
    this.id = id;
    this.brandOne = brandOne;
    this.brandTwo = brandTwo;
  }
}
