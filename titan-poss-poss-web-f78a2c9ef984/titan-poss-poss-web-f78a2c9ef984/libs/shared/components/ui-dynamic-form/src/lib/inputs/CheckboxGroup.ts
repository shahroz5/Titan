
import { BaseElementParams } from './base/BaseElementParams';
import { SelectOption } from './SelectOption';
import { BaseElement } from './base/BaseElement';

export class CheckboxGroup extends BaseElement {
    public options: SelectOption[];
    constructor(name: string, options: SelectOption[], inputParams: BaseElementParams) {
        super(name, inputParams);
        this.options = options;
        this.controlType = 'checkbox';
    }
}
