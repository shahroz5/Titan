import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-delete-row',
  templateUrl: './delete-row.component.html',
  styleUrls: ['./delete-row.component.scss']
})
export class DeleteRowComponent implements ICellRendererAngularComp {
  params: any;
  showDeleteIcon = true;



  agInit(params: any) {
    this.params = params;
    if (params?.data?.published === 'YES') {
      //This check is added to conditionally render delete icon for app version dashboard
      this.showDeleteIcon = false;
    }
  }

  deleteRow() {
    this.params.context.componentParent?.openConfirmDialogForDelete({
      ...this.params.data,
      rowIndex: this.params.rowIndex
    });
  }
  refresh(): boolean {
    return true;
  }
}
