import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Validation,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';
import {
    FieldValidatorsService,
    PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class TcsConfigFormSixtyModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'Indian Customer %'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.percentageField,
                options: { fieldKey: 'Indian Customer %' }
            }
        ]
    })
    private indianCustomerPercent: string;

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'Non Indian Customer %'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.percentageField,
                options: { fieldKey: 'pw.brandMaster.nonIndianCustomerPer' }
            }
        ]
    })
    private nonIndianCustomerPercent: string;

    @FormField({
        fieldType: FormFieldType.RADIO,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'checked'
        },
        label: ''
    })
    @Class({ className: [''] })
    private tcsConfigJewlryRadio: { id: string; name: string; checked?: boolean }[];

    constructor(
        id: number,
        indianCustomerPercent: string,
        nonIndianCustomerPercent: string,
        tcsConfigJewlryRadio: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.indianCustomerPercent = indianCustomerPercent;
        this.nonIndianCustomerPercent = nonIndianCustomerPercent;
        this.tcsConfigJewlryRadio = tcsConfigJewlryRadio;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  