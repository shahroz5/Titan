import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-delete-all-rows',
  templateUrl: './delete-all-rows.component.html',
  styleUrls: ['./delete-all-rows.component.scss']
})
export class DeleteAllRowsComponent implements ICellRendererAngularComp {
  params: any;


  agInit(params: any) {
    this.params = params;
  }
  deleteAllRows() {
    this.params.context.componentParent.openConfirmDialogForDeleteAll();
  }
  refresh(): boolean {
    return true;
  }
}
