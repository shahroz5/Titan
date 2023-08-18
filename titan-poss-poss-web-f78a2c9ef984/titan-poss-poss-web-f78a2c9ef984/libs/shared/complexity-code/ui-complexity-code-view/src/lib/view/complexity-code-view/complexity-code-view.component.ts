import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-complexity-code-view',
  templateUrl: './complexity-code-view.component.html'
})
export class ComplexityCodeViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<ComplexityCodeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}


  onClose() {
    this.dialog.closeAll();
  }
}
