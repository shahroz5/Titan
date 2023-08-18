import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { PrintDetailsModel } from './print-details.model';
import { PrintWastageModel } from './print-wastage.model';

export class PrintMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.printWastage',
        hide: false
    })
    private printWastage: PrintWastageModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.PrintDetails',
        hide: false
    })
    private printDetails: PrintDetailsModel;

    constructor(id: number, printWastage: PrintWastageModel, printDetails: PrintDetailsModel) {
        super();
        this.id = id;
        this.printWastage = printWastage;
        this.printDetails = printDetails;
    }
}
