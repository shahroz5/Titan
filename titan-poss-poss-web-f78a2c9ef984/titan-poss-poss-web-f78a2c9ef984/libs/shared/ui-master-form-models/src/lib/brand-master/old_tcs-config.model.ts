import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';
import {
    FieldValidatorsService,
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class TcsConfigModel extends DynamicFormFieldsBuilder {
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
    private tcsConfig_checkBox: { id: string; name: string; checked?: boolean }[];

    constructor(
        id: number,
        tcsConfig_checkBox: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.tcsConfig_checkBox = tcsConfig_checkBox;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}
