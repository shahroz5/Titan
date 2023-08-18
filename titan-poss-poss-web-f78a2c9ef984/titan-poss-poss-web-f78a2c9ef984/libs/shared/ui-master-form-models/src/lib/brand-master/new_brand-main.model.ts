import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { BrandDetailsModel } from './new_brand-details.model';

export class BrandMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: '',
        hide: false
    })
    private brandDetailsModel: BrandDetailsModel;

    constructor(id: number,
        brandDetailsModel: BrandDetailsModel
    ) {
        super();
        this.id = id;
        this.brandDetailsModel = brandDetailsModel;
    }
}
