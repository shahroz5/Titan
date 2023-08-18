import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { GhsFormDetailsModel } from './ghs-details.model';

export class GhsMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.GHSDetails',
        hide: false
    })
    private GhsDetails: GhsFormDetailsModel;


    constructor(id: number, GhsDetails: GhsFormDetailsModel) {
        super();
        this.id = id;
        this.GhsDetails = GhsDetails;
    }
}
