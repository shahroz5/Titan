import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RefundStatusEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-add-cheque-details-button',
  templateUrl: './add-cheque-details-button.component.html'
})
export class AddChequeDetailsButtonComponent
  implements ICellRendererAngularComp {
  params: any;
  status: string;
  index: number;
  refundStatusEnum = RefundStatusEnum;

  agInit(params: any): void {
    this.params = params;
    this.status = this.params.data;
    this.index = this.params.rowIndex;
  }

  refresh(params: any): boolean {
    this.params = params;
    this.index = this.params.rowIndex;
    this.status = this.params.data;
    return true;
  }

  showChequeDetailsPopUp() {
    this.params.context.componentParent?.showChequeDetailsPopUp(this.index);
  }
}
