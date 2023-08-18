import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-lot-number-and-quantity',
  templateUrl: './lot-number-and-quantity.component.html'
})
export class LotNumberAndQuantityComponent implements ICellRendererAngularComp {
  displayValue: any;
  params: any;
  isCOMOrder = false;
  productGroup;

  agInit(params: any) {
    this.params = params;
    this.isCOMOrder = params.data?.isCOMOrder ? params.data?.isCOMOrder : false;
    this.productGroup = params.data?.productGroup;
    this.displayValue = params.valueFormatted
      ? params.valueFormatted
      : params.value;
  }

  refresh(params: any): boolean {
    this.params = params;
    this.displayValue = params.valueFormatted
      ? params.valueFormatted
      : params.value;
    return true;
  }
}
