import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-value-percentage-toggle',
  templateUrl: './value-percentage-toggle.component.html',
  styleUrls: ['./value-percentage-toggle.component.scss']
})
export class ValuePercentageToggleComponent
  implements ICellRendererAngularComp {
  form: FormGroup;
  oldValue: any;
  params: any;
  currencyCode: string;

  hasPercent = true;
  constructor(private formbuilder: FormBuilder) {}

  agInit(params: any) {
    this.params = params;
    this.hasPercent = this.params?.data?.hasPercent;
    this.form = this.formbuilder.group({
      isPercent: [params.value.isPercent]
    });

    this.oldValue = params.value;

    this.currencyCode = this.params.context['currencyCode'];
  }

  valueCheck(value): boolean {
    return !(value == null || value === '' || isNaN(value));
  }

  typeChange(isChecked) {
    if (isChecked && Number.parseFloat(this.oldValue.value) > 100) {
      this.oldValue.isValid = false;
    }

    if (
      !isChecked &&
      this.valueCheck(this.oldValue.value) &&
      this.oldValue.value >= 0
    ) {
      this.oldValue.isValid = true;
    }

    this.oldValue.isPercent = isChecked;

    const newData = {
      ...this.params.data,
      [this.params?.colDef?.field]: this.oldValue
    };

    if (this.params?.context?.componentParent?.typeChange) {
      this.params.context.componentParent.typeChange(newData);
    }
  }

  refresh() {
    return false;
  }

  getValue() {
    return {
      ...this.oldValue,
      isPercent: this.form.value.isPercent
    };
  }
}
