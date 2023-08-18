import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';

export class DateTimePicker extends BaseElement {

    constructor(name: string, inputParams: BaseElementParams) {
        super(name, inputParams, 'datetimepicker');
        this.controlType = 'datetimepicker';
    }
}
