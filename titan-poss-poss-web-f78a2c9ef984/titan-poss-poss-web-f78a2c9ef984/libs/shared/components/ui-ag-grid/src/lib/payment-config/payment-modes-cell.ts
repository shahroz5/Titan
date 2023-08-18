import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-payment-modes-cell',
  template: `
    <div class="row ">
      <div class="col-6">
        {{ params.title }}
      </div>
      <div class="col-5 pw-text-right">
        ( {{ params.selectedCount }}/{{ params.totalCount }})
      </div>
    </div>
  `
})
export class PaymentModesCellComponent implements ICellRendererAngularComp {
  params;



  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params.data;
  }
}
