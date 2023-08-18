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

export class FocDetailsModel extends DynamicFormFieldsBuilder {
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
    private focDetailsCheckbox1: { id: string; name: string; checked?: boolean }[];

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.maxWeightForFOCgms'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.weightField,
                options: { fieldKey: 'pw.locationMaster.maxWeightForFOCgms' }
            }
        ]
    })
    private maxWeight: string;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.maxValueforFOC(gms)'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.numbersField,
                options: { fieldKey: 'pw.locationMaster.maxValueforFOC(gms)' }
            }
        ]
    })
    private maxValue: string;

    constructor(
        id: number,
        focDetailsCheckbox1: { id: string; name: string; selected?: boolean }[],
        maxWeight: string,
        maxValue: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.focDetailsCheckbox1 = focDetailsCheckbox1;
        this.maxWeight = maxWeight;
        this.maxValue = maxValue;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  