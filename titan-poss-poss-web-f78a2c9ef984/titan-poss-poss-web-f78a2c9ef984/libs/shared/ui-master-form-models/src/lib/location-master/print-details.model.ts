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

export class PrintDetailsModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.freeTextForGrams'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.alphaNumericWithSpaceField,
                options: { fieldKey: 'pw.locationMaster.freeTextForGrams' }
            }
        ]
    })
    private freeTextForGrams: string;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.QuickCM'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.numbersField,
                options: { fieldKey: 'pw.locationMaster.QuickCM' }
            }
        ]
    })
    private invoiceCopies: string;


    @FormField({
        fieldType: FormFieldType.SELECT,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'selected'
        },
        label: 'pw.locationMaster.invoiceType'
    })
    @Class({ className: ['row'] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.requiredField,
                options: { fieldKey: 'pw.locationMaster.invoiceType' }
            }
        ]
    })
    private printDetailsSelect: { id: string; name: string; selected?: boolean }[];

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
    private printDetailsCheckbox1: { id: string; name: string; checked?: boolean }[];



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
    private printDetailsCheckbox2: { id: string; name: string; checked?: boolean }[];


    constructor(
        id: number,
        freeTextForGrams: string,
        invoiceCopies: string,
        printDetailsSelect: { id: string; name: string; selected?: boolean }[],
        printDetailsCheckbox1: { id: string; name: string; checked?: boolean }[],
        printDetailsCheckbox2: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.freeTextForGrams = freeTextForGrams;
        this.invoiceCopies = invoiceCopies;
        this.printDetailsSelect = printDetailsSelect;
        this.printDetailsCheckbox1 = printDetailsCheckbox1;
        this.printDetailsCheckbox2 = printDetailsCheckbox2;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  