/* import { Class, DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { TcsConfigBullionModel } from './new_tcs-config-bullion.model';
import { TcsConfigFormSixtyModel } from './new_tcs-config-formSixty.model';
import { TcsConfigJewelryModel } from './new_tcs-config-Jewelry.model';
import { TcsConfigSilverPlatinumModel } from './new_tcs-config-silverPlatinum.model';
import { TcsConfigModel } from './new_tcs-config.model';

export class TcsConfigMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: '',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-3-column'] })
    private tcsConfigModel: TcsConfigModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.brandMaster.forJewelry',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-3-column'] })
    private tcsConfigJewelryModel: TcsConfigJewelryModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.brandMaster.form60',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-3-column'] })
    private tcsConfigFormSixtyModel: TcsConfigFormSixtyModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.brandMaster.bullion',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-3-column'] })
    private tcsConfigBullionModel: TcsConfigBullionModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.brandMaster.silverPlatinum',
        hide: false
    })
    @Class({ className: ['pw-form-card__flex-2-column'] })
    private tcsConfigSilverPlatinumModel: TcsConfigSilverPlatinumModel;

    constructor(id: number,
        tcsConfigModel: TcsConfigModel,
        tcsConfigJewelryModel: TcsConfigJewelryModel,
        tcsConfigFormSixtyModel: TcsConfigFormSixtyModel,
        tcsConfigBullionModel: TcsConfigBullionModel,
        tcsConfigSilverPlatinumModel: TcsConfigSilverPlatinumModel
    ) {
        super();
        this.id = id;
        this.tcsConfigModel = tcsConfigModel;
        this.tcsConfigJewelryModel = tcsConfigJewelryModel;
        this.tcsConfigFormSixtyModel = tcsConfigFormSixtyModel;
        this.tcsConfigBullionModel = tcsConfigBullionModel;
        this.tcsConfigSilverPlatinumModel = tcsConfigSilverPlatinumModel;
    }
}
 */