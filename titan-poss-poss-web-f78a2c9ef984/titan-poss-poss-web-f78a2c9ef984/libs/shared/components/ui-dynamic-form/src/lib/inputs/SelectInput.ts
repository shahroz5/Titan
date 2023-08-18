import { BaseElement } from './base/BaseElement';
import { BaseElementParams } from './base/BaseElementParams';
import { SelectOption } from './SelectOption';

export class SelectInput extends BaseElement {
  public options: SelectOption[];
  public dependsOn: string;

  constructor(
    name: string,
    options: SelectOption[],
    params: BaseElementParams
  ) {
    super(name, params);
    this.options = options;
    this.controlType = 'select';
    this.dependsOn = params.dependsOn;
  }
}
