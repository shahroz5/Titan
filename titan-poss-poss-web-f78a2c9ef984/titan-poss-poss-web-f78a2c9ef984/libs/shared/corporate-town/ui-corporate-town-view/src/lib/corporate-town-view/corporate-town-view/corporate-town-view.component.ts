import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-corporate-town-view',
  templateUrl: './corporate-town-view.component.html'
})
export class CorporateTownViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<CorporateTownViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}


  onClose() {
    this.dialog.closeAll();
  }
}
