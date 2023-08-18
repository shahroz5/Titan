import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { FocDetailsModel } from './foc-details.model';

export class FocMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.FOCDetails',
        hide: false
    })
    private focDetailsModel: FocDetailsModel;


    constructor(id: number, focDetailsModel: FocDetailsModel) {
        super();
        this.id = id;
        this.focDetailsModel = focDetailsModel;
    }
}
