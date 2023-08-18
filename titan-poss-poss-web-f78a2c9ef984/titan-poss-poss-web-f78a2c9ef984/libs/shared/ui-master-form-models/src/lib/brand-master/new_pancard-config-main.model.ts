import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { PancardConfigModel } from './new_pancard-config.model';

export class PancardConfigFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: '',
        hide: false
    })
    private pancardConfigModel: PancardConfigModel;

    constructor(id: number,
        pancardConfigModel: PancardConfigModel
    ) {
        super();
        this.id = id;
        this.pancardConfigModel = pancardConfigModel;
    }
}
