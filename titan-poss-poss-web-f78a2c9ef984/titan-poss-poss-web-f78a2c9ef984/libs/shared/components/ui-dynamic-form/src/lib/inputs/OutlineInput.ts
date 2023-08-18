import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';

export class OutlineInput extends BaseElement {

    constructor(name: string, inputParams: BaseElementParams) {
        super(name, inputParams);
        this.controlType = 'outlineinput';
    }
}
