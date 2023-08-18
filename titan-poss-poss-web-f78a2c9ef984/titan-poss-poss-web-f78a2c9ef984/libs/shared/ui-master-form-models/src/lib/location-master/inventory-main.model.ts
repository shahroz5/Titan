import { DynamicFormFieldsBuilder, FormField, FormFieldType } from '@poss-web/shared/components/ui-dynamic-form';
import { InventoryASSMModel } from './inventory-assm.model';
import { InventoryDetailsModel } from './inventory-details.model';

export class InventoryMainFormModel extends DynamicFormFieldsBuilder {
    private id: number;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.inventoryDetails',
        hide: false
    })
    private inventoryDetailsModel: InventoryDetailsModel;

    @FormField({
        fieldType: FormFieldType.SUB_FORM,
        label: 'pw.locationMaster.assm',
        hide: false
    })
    private inventoryASSMModel: InventoryASSMModel;


    constructor(id: number,
        inventoryDetailsModel: InventoryDetailsModel,
        inventoryASSMModel: InventoryASSMModel
    ) {
        super();
        this.id = id;
        this.inventoryDetailsModel = inventoryDetailsModel;
        this.inventoryASSMModel = inventoryASSMModel;
    }
}
