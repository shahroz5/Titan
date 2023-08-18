import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-country-view',
  templateUrl: './country-view.component.html'
})
export class CountryViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<CountryViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    console.log('data', data);
  }


  onClose() {
    this.dialog.closeAll();
  }
}
