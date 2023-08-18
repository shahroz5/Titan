import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-discount-total',
  templateUrl: './discount-total.component.html',
  styleUrls: ['./discount-total.component.scss']
})
export class DiscountTotalComponent implements ICellRendererAngularComp {
  discountValue: number;
  maxDiscount: number;
  isValid: boolean;
  isBlank: boolean;
  currencyCode: string;
  params: any;


  agInit(params: any) {
    this.fetchData(params);
  }

  refresh(params: any): boolean {
    this.fetchData(params);

    return true;
  }
  fetchData(params) {
    this.discountValue = params.data.discountValue;
    this.maxDiscount = params.data.maxDiscount;
    this.isValid = params.data.isValid;
    this.currencyCode = params.context?.currencyCode;
    this.isBlank = params.data.isBlank;
  }
}
