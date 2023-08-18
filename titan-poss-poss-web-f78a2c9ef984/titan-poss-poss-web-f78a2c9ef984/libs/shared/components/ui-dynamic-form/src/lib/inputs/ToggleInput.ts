import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';
import { SelectOption } from './SelectOption';

export class ToggleInput extends BaseElement {

    public options: SelectOption[];
    constructor(name: string, options: SelectOption[], inputParams: BaseElementParams) {
        super(name, inputParams);
        this.options = options;
        this.controlType = 'toggle';
    }
}
