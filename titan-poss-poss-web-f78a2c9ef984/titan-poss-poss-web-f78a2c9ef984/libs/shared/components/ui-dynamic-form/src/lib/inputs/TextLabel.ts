import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';

export class TextLabel extends BaseElement {

    constructor(name: string, inputParams: BaseElementParams) {
        super(name, inputParams);
        this.controlType = 'textlabel';
    }
}
