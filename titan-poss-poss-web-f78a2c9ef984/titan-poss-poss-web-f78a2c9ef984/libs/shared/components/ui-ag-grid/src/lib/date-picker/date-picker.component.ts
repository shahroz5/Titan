import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: []
})
export class DatePickerComponent implements ICellEditorAngularComp {
  datePickerForm: FormGroup;
  autocomplete = 'off';
  oldValue: any;
  params: any;
  currentDate = moment();

  constructor(private formbuilder: FormBuilder) {}

  agInit(params: any) {
    this.params = params;
    this.datePickerForm = this.formbuilder.group({
      datePicker: [
        typeof params.value === 'object' && params.value
          ? params.value.value
            ? params.value.value
            : ''
          : params.value,
        params.context.validators[`${params.colDef.field}`]
      ]
    });
    this.oldValue = this.datePickerForm.value.datePicker;
  }

  getValue() {
    return {
      value: this.datePickerForm.value.datePicker,
      isValid: this.datePickerForm.valid,
      oldValue: this.oldValue
    };
  }
}
