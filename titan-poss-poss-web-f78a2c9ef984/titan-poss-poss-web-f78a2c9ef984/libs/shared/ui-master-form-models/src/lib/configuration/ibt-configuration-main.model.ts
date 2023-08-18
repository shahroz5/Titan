import {
    DynamicFormFieldsBuilder,
    FormField,
    FormFieldType,

} from '@poss-web/shared/components/ui-dynamic-form';
import { ConfigurationModel } from './configuration.model';
import { IbtConfigurationValueModel } from './ibt-configuration-values.model';


export class IbtConfigurationMainModel extends DynamicFormFieldsBuilder {
    private id: number;
    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.ibtConfiguration.configuration',
        hide: false
    })
    private configuration: ConfigurationModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.ibtConfiguration.inputthedetailsbelowLabel',
        hide: false
    })
    private ibtConfiguration: IbtConfigurationValueModel;

    constructor(id: number, configuration: ConfigurationModel, ibtConfiguration: IbtConfigurationValueModel) {
        super();
        this.id = id;
        this.configuration = configuration;
        this.ibtConfiguration = ibtConfiguration
    }
}
