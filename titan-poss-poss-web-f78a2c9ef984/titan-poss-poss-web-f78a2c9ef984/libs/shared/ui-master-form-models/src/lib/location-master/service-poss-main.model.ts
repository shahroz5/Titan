import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { ServicePossFormDetailsModel } from './service-poss-details.model';

export class ServicePossMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.ServicePossDetails',
        hide: false
    })
    private ServicePossDetails: ServicePossFormDetailsModel;

    constructor(id: number, ServicePossDetails: ServicePossFormDetailsModel) {
        super();
        this.id = id;
        this.ServicePossDetails = ServicePossDetails;
    }
}
