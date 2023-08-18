import { BaseElementParams } from './base/BaseElementParams';
import { SelectOption } from './SelectOption';
import { BaseElement } from './base/BaseElement';

export class RadioButtonGroup extends BaseElement {

    public options: SelectOption[];
    public subForm: string[];
    public show: string[];

    constructor(name: string, options: SelectOption[], params: BaseElementParams) {
        super(name, params);
        this.options = options;
        this.controlType = 'radio';
        this.subForm = params.subForm;
        this.show = params.show;
    }
}
