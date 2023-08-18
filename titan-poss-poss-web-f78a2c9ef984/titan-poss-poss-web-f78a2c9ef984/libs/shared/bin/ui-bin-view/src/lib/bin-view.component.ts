import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-bin-view',
  templateUrl: './bin-view.component.html',
  styleUrls: ['./bin-view.component.scss']
})
export class BinViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<BinViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: {
    dropDown: any;
    editData: any;
    binGroup: any;
  };



  onClose() {
    this.dialogRef.close();
  }
}
