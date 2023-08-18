import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { PaymentDetailsModel } from './payment-details.model';

export class PaymentMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.PaymentDetails',
        hide: false
    })
    private paymentDetailsModel: PaymentDetailsModel;


    constructor(id: number, paymentDetailsModel: PaymentDetailsModel) {
        super();
        this.id = id;
        this.paymentDetailsModel = paymentDetailsModel;
    }
}
