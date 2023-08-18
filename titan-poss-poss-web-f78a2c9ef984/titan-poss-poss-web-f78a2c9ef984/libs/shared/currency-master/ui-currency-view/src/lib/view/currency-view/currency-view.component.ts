import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-currency-view',
  templateUrl: './currency-view.component.html'
})
export class CurrencyViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<CurrencyViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}
  onClose() {
    this.dialog.closeAll();
  }

}
