import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-delete-all-gc-rows',
  templateUrl: './delete-all-gc-rows.component.html',
  styleUrls: []
})
export class DeleteAllGcRowsComponent implements ICellRendererAngularComp {
  params: any;


  agInit(params: any) {
    this.params = params;
  }
  deleteAllRows() {
    this.params.context.componentParent.openConfirmDialogForDeleteAll();
  }
  refresh(params: any): boolean {
    return true;
  }
}
