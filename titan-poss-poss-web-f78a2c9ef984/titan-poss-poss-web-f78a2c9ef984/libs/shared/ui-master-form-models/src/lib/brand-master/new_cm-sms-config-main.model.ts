import { Class, DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { CmSMSConfigModel } from './new_cm-sms-config.model';

export class CmSMSConfigMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: '',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-3-column'] })
    private cmSMSConfigModel: CmSMSConfigModel;

    constructor(id: number,
        cmSMSConfigModel: CmSMSConfigModel
    ) {
        super();
        this.id = id;
        this.cmSMSConfigModel = cmSMSConfigModel;
    }
}
