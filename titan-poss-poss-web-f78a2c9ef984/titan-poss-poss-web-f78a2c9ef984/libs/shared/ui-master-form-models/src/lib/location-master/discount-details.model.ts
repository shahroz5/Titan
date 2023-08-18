import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';

export class DiscountDetailsModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.CHECKBOX,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'checked'
        },
        label: ''
    })
    @Class({ className: ['row'] })
    private DiscountDetailsCheckbox1: { id: string; name: string; checked?: boolean }[];


    constructor(
        id: number,
        DiscountDetailsCheckbox1: { id: string; name: string; selected?: boolean }[],
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.DiscountDetailsCheckbox1 = DiscountDetailsCheckbox1;
        this.TranslateService = translateService;
    }
}
