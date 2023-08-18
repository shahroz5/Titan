import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';

export class AmountInput extends BaseElement {

    constructor(name: string, inputParams: BaseElementParams) {
        super(name, inputParams);
        this.controlType = 'amount';
    }
}
