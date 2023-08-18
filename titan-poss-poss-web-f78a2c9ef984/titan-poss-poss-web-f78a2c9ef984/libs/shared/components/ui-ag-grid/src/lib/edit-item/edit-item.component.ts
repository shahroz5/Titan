import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements ICellRendererAngularComp {
  displayValue: any;
  params: any;


  agInit(params: any) {
    this.displayValue = params.valueFormatted
      ? params.valueFormatted
      : params.value;
  }

  refresh(params: any): boolean {
    this.displayValue = params.valueFormatted
      ? params.valueFormatted
      : typeof params.value === 'object'
      ? params.value.value
        ? params.value.value
        : ''
      : params.value;
    return true;
  }
}
