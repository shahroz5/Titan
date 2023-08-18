import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { DiscountDetailsModel } from './discount-details.model';

export class DiscountMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.discountDetails',
        hide: false
    })
    private discountDetailsModel: DiscountDetailsModel;


    constructor(id: number, discountDetailsModel: DiscountDetailsModel) {
        super();
        this.id = id;
        this.discountDetailsModel = discountDetailsModel;
    }
}
