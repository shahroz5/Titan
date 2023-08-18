import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-delete-gc-row',
  templateUrl: './delete-gc-row.component.html',
  styleUrls: ['./delete-gc-row.component.scss']
})
export class DeleteGcRowComponent implements ICellRendererAngularComp {

  params: any;


  agInit(params: any) {
    this.params = params;
  }

  deleteRow() {
    this.params.context.componentParent.openConfirmDialogForDelete(
      this.params.data
    );
  }

  refresh(params: any): boolean {
    return true;
  }

}
