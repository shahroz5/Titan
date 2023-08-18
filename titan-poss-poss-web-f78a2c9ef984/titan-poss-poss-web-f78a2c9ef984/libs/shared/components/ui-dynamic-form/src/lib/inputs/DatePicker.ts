import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';

export class DatePicker extends BaseElement {

    constructor(name: string, inputParams: BaseElementParams) {
        super(name, inputParams, 'datepicker');
        this.controlType = 'datepicker';
    }
}
