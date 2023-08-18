import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
    FieldValidatorsService,
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class CustomerKycModel extends DynamicFormFieldsBuilder {
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
    @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
    private customerKycCheckbox: { id: string; name: string; checked?: boolean }[];


    constructor(
        id: number,
        customerKycCheckbox: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.customerKycCheckbox = customerKycCheckbox;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}
