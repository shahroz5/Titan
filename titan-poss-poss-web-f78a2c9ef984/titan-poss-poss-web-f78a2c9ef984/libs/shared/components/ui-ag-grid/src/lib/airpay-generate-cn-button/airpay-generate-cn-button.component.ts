import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-airpay-generate-cn-button',
  templateUrl: './airpay-generate-cn-button.component.html'
})
export class AirpayGenerateCNButtonComponent
  implements ICellRendererAngularComp {
  params: any;

  status: string;

  agInit(params: any): void {
    this.params = params;

    this.status = this.params.data.status;
  }
  refresh(params: any): boolean {
    this.params = params;

    this.status = this.params.data.status;
    return true;
  }

  generateCN() {
    this.params.context.componentParent?.generateCN(this.params.data);
  }
}
