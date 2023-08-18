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

export class LocationCurrencyModel extends DynamicFormFieldsBuilder {
    private id: number;


    @FormField({
        fieldType: FormFieldType.SELECT,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'selected'
        },
        label: 'pw.locationMaster.baseCurrency'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.requiredField,
                options: { fieldKey: 'pw.locationMaster.baseCurrency' }
            }
        ],
    })
    private baseCurrency: { id: string; name: string; selected?: boolean }[];

    @FormField({
        fieldType: FormFieldType.SELECT,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'selected'
        },
        label: 'pw.locationMaster.masterCurrency'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.requiredField,
                options: { fieldKey: 'pw.locationMaster.masterCurrency' }
            }
        ],
    })
    private masterCurrency: { id: string; name: string; selected?: boolean }[];

    @FormField({
        fieldType: FormFieldType.SELECT,
        selectOptionKeys: {
            labelKey: 'name',
            valueKey: 'id',
            selectedKey: 'selected'
        },
        label: 'pw.locationMaster.paymentCurrency'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.requiredField,
                options: { fieldKey: 'pw.locationMaster.paymentCurrency' }
            }
        ],
    })
    private paymentCurrency: { id: string; name: string; selected?: boolean }[];


    constructor(
        id: number,
        baseCurrency: { id: string; name: string; checked?: boolean }[],
        masterCurrency: { id: string; name: string; checked?: boolean }[],
        paymentCurrency: { id: string; name: string; checked?: boolean }[],
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.baseCurrency = baseCurrency;
        this.masterCurrency = masterCurrency;
        this.paymentCurrency = paymentCurrency;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  