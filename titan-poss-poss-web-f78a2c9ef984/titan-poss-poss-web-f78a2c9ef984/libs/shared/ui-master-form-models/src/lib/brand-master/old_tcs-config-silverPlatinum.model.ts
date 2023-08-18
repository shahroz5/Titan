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

export class TcsConfigSilverPlatinumModel extends DynamicFormFieldsBuilder {
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
    private tcsConfigSilverPlatinum_checkBox: { id: string; name: string; checked?: boolean }[];

    constructor(
        id: number,
        tcsConfigSilverPlatinum_checkBox: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.tcsConfigSilverPlatinum_checkBox = tcsConfigSilverPlatinum_checkBox;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}
