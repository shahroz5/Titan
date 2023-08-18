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

export class PrintWastageModel extends DynamicFormFieldsBuilder {
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
    private printCheckbox: { id: string; name: string; checked?: boolean }[];

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.makingChargesWastageHeading'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.descriptionField,
                options: { fieldKey: 'pw.locationMaster.makingChargesWastageHeading' }
            }
        ]
    })
    private makingCharges: string;

    constructor(
        id: number,
        printCheckbox: { id: string; name: string; checked?: boolean }[],
        makingCharges: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.printCheckbox = printCheckbox;
        this.makingCharges = makingCharges;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  