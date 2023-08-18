import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TaxMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tax-master-view',
  templateUrl: './tax-master-view.component.html',
  styleUrls: ['./tax-master-view.component.scss']
})
export class TaxMasterViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<TaxMasterViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: TaxMasterDetails;



  onClose() {
    this.dialogRef.close();
  }
}
