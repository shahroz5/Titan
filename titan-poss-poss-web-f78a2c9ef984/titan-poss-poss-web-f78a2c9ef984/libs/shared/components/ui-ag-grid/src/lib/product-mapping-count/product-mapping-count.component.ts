import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-payment-modes-cell',
  templateUrl: './product-mapping-count.component.html',
  styleUrls: ['./product-mapping-count.component.scss']
})
export class ProductMappingCountComponent implements ICellRendererAngularComp {
  params;
  rowIndex: number;
  context;
  disable = true;


  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params.data;

    this.rowIndex = params.rowIndex;
    this.context = params.context;
    if (this.params.id) {
      this.disable = false;
    } else {
      this.disable = true;
    }
  }
  openPopUp() {
    this.context.componentParent.productGroupMapping(
      this.params,
      this.rowIndex,
      true
    );
  }
}
