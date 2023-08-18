import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-airpay-verify-payment',
  templateUrl: './airpay-verify-payment.component.html',
  styleUrls: ['./airpay-verify-payment.component.scss']
})
export class AirpayVerifyPaymentComponent implements ICellRendererAngularComp {
  params: any;
  value: any = null;
  status: string;


  agInit(params: any): void {
    this.params = params;
    this.value = this.params.data.isVerifying;
    this.status = this.params.data.status;
  }
  refresh(params: any): boolean {
    this.params = params;
    this.value = this.params.data.isVerifying;
    this.status = this.params.data.status;
    return true;
  }
  verifyRow() {
    this.params.context.componentParent?.verifyPayment(this.params.data);
  }
}
