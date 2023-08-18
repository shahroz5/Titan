import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { BankingDetailsModel } from './banking-details.model';

export class BankingMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.bankingDetails',
        hide: false
    })
    private bankingDetailsModel: BankingDetailsModel;


    constructor(id: number, bankingDetailsModel: BankingDetailsModel) {
        super();
        this.id = id;
        this.bankingDetailsModel = bankingDetailsModel;
    }
}
