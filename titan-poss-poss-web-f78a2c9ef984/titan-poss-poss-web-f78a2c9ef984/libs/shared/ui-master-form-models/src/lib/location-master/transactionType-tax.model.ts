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

export class TransactionTypeTaxModel extends DynamicFormFieldsBuilder {
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
    private isGSTEnabled: { id: string; name: string; checked?: boolean }[];

    @FormField({
        fieldType: FormFieldType.TEXT,
        label: 'pw.locationMaster.GSTRegistrationNo'
    })
    @Class({ className: [] })
    @Validation({
        customValidators: [
            {
                name: PossWebFieldValidators.gstNumberField,
                options: { fieldKey: 'pw.locationMaster.GSTRegistrationNo' }
            }
        ],
        inputConstraint: PossWebFieldValidators.gstNumberField
    })
    private gstRegistrationNo: string;

    @FormField({
        fieldType: FormFieldType.DATE,
        label: 'pw.locationMaster.GSTValidfrom'
    })
    @Class({ className: [] })
    private gstValidFrom: string;

    @FormField({
        fieldType: FormFieldType.DATE,
        label: 'pw.locationMaster.GSTPrintValidfrom'
    })
    @Class({ className: [] })
    private gstPrintValidFrom: string;

    constructor(
        id: number,
        isGSTEnabled: { id: string; name: string; checked?: boolean }[],
        gstRegistrationNo: string,
        gstValidFrom: string,
        gstPrintValidFrom: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService
    ) {
        super();
        this.id = id;
        this.isGSTEnabled = isGSTEnabled;
        this.gstRegistrationNo = gstRegistrationNo;
        this.gstValidFrom = gstValidFrom;
        this.gstPrintValidFrom = gstPrintValidFrom;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;
    }
}  