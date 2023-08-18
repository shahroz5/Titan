import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Validation,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
    FieldValidatorsService,
    PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class OtpDetailsModel extends DynamicFormFieldsBuilder {
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
    private otpDetailsCheckbox: { id: string; name: string; checked?: boolean }[];


    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.otpEmail'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.emailField,
                options: { fieldKey: 'pw.locationMaster.otpEmail' }
            }
        ]
    })
    private helpdeskEmailId: string;

    constructor(
        id: number,
        otpDetailsCheckbox: { id: string; name: string; checked?: boolean }[],
        helpdeskEmailId: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.otpDetailsCheckbox = otpDetailsCheckbox;
        this.helpdeskEmailId = helpdeskEmailId;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  