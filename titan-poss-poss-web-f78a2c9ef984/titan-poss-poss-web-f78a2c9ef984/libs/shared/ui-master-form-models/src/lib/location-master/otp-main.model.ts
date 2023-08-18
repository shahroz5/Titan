import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { OtpDetailsModel } from './otp-details.model';

export class OtpMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'OTP Details',
        hide: false
    })
    private otpDetailsModel: OtpDetailsModel;


    constructor(id: number, otpDetailsModel: OtpDetailsModel) {
        super();
        this.id = id;
        this.otpDetailsModel = otpDetailsModel;
    }
}
