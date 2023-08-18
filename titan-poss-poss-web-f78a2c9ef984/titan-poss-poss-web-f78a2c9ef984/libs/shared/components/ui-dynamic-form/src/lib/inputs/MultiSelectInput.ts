import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';
import { SelectOption } from './SelectOption';

export class MultiSelectInput extends BaseElement {
    public options: SelectOption[];
    public dependsOn: string;

    constructor(name: string, options: SelectOption[], params: BaseElementParams) {
        super(name, params);
        this.options = options;
        this.controlType = 'multiselect';
        this.dependsOn = params.dependsOn;
    }
}
