import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-hyper-link-cell',
  templateUrl: './hyper-link-cell.component.html'
})
export class HyperLinkCellComponent implements ICellRendererAngularComp {
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
  emitParams() {
    this.context.componentParent.fileView(this.params);
  }
}
