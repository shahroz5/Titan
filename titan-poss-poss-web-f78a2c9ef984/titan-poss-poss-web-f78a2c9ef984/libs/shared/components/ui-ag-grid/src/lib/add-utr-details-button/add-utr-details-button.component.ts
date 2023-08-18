import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RefundStatusEnum } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-add-utr-details-button',
  templateUrl: './add-utr-details-button.component.html'
})
export class AddUtrDetailsButtonComponent implements ICellRendererAngularComp {
  params: any;

  status: string;
  index: number;
  refundStatusEnum = RefundStatusEnum;

  agInit(params: any): void {
    this.params = params;
    this.index = this.params.rowIndex;
    this.status = this.params.data;
  }

  refresh(params: any): boolean {
    this.params = params;
    this.status = this.params.data;
    this.index = this.params.rowIndex;
    return true;
  }

  showUtrDetailsPopUp() {
    this.params.context.componentParent?.showUtrDetailsPopUp(this.index);
  }
}
