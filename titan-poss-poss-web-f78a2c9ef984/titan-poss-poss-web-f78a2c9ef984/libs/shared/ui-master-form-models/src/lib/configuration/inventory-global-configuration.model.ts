import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,
    Validation,
    Class
} from '@poss-web/shared/components/ui-dynamic-form';


import { FieldValidatorsService, PossWebFieldValidators } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
export class InvGlobalConfigurationModel extends DynamicFormFieldsBuilder {
    private id: number;
    @FormField({
        fieldType: FormFieldType.OUTLINE,
        label: 'pw.invGlobalConfiguration.maxTimeToMoveTranscToHistroy'
    })
    @Validation({
        customValidators: [
            { name: PossWebFieldValidators.numbersField, options: { fieldKey: 'pw.invGlobalConfiguration.maxTimeToMoveTranscToHistroy' } },
            { name: PossWebFieldValidators.requiredField, options: { fieldKey: 'pw.invGlobalConfiguration.maxTimeToMoveTranscToHistroy' } },
        ],
        inputConstraint: PossWebFieldValidators.numbersField
    })
    @Class({ className: ['col-12'] })
    private maxTimeToMoveTranscToHistroy: string;

    constructor(
        id: number,
        maxTimeToMoveTranscToHistroy: string,
        fieldValidatorsService: FieldValidatorsService,
        translateService: TranslateService

    ) {
        super();
        this.id = id;
        this.maxTimeToMoveTranscToHistroy = maxTimeToMoveTranscToHistroy;
        this.FieldValidatorsService = fieldValidatorsService;
        this.TranslateService = translateService;

    }
}
