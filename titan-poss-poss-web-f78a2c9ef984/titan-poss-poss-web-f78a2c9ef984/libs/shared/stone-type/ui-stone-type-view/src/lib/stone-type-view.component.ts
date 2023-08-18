import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-stone-type-view',
  templateUrl: './stone-type-view.component.html',
  styleUrls: ['./stone-type-view.component.scss']
})
export class StoneTypeViewComponent  {
  dialogData: any;

  constructor(
    public dialogRef: MatDialogRef<StoneTypeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data.newFormData;
  }



  onClose() {
    this.dialogRef.close();
  }
}
