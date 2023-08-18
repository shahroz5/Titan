import { FormFieldOptions } from '../decorators/FormFieldOptions';
import { ClassOptions } from '../decorators/ClassOptions';

export class SubFormInput {

    public parentFormId: number;
    public fields: any[];
    public controlType: string;
    public name: string;
    public label: string;
    public classNames?: string[]; // Avi
    public hide: boolean;

    constructor(parentFormId: number, fields: any[], name: string, formFieldOptions: FormFieldOptions, classOptions: ClassOptions) {

        this.parentFormId = parentFormId;
        this.fields = fields;
        this.controlType = 'subForm';
        this.name = parentFormId + '-' + name;
        this.label = formFieldOptions.label;
        this.classNames = classOptions.className;
        this.hide = formFieldOptions.hide ? formFieldOptions.hide : false;
    }
}
