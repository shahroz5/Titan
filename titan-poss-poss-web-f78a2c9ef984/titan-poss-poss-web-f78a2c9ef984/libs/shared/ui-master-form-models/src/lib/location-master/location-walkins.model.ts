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

export class LocationWalkinsModel extends DynamicFormFieldsBuilder {
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
    @Class({ className: ['rm-padding-left', 'pw-form-card__checkbox-container'] })
    @Validation({
        customValidators: [],
    })
    private walkInDetails: { id: string; name: string; selected?: boolean }[];

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.numberOfDaysToEnter'
    })
    @Class({ className: [] })
    // @Validation({ validators: [Validators.required] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.numbersField,
                options: { fieldKey: 'pw.locationMaster.numberOfDaysToEnter' }
            }
        ],
        inputConstraint: PossWebFieldValidators.locationCodeField
    })
    private numberOfDaysToEnter: string;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.numberOfDaysToDisplay'
    })
    @Class({ className: [] })
    // @Validation({ validators: [Validators.required] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.numbersField,
                options: { fieldKey: 'pw.locationMaster.numberOfDaysToDisplay' }
            }
        ],
        inputConstraint: PossWebFieldValidators.locationCodeField
    })
    private numberOfDaysToDisplay: string;

    constructor(
        id: number,
        walkInDetails: { id: string; name: string; checked?: boolean }[],
        numberOfDaysToEnter: string,
        numberOfDaysToDisplay: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.walkInDetails = walkInDetails;
        this.numberOfDaysToEnter = numberOfDaysToEnter;
        this.numberOfDaysToDisplay = numberOfDaysToDisplay;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  