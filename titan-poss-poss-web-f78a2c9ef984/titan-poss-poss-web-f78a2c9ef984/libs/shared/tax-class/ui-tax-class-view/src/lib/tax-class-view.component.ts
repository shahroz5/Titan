import { Component, Inject } from '@angular/core';
import { TaxClassDetails } from '@poss-web/shared/models';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-tax-class-view',
  templateUrl: './tax-class-view.component.html',
  styleUrls: ['./tax-class-view.component.scss']
})
export class TaxClassViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<TaxClassViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: TaxClassDetails;



  onClose() {
    this.dialogRef.close();
  }
}
