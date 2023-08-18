import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { BinGroupDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-group-view',
  templateUrl: './bin-group-view.component.html'
})
export class BinGroupViewComponent {
  constructor(
    public dialogRef: MatDialogRef<BinGroupViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }
  dialogData: BinGroupDetails;

  onClose() {
    this.dialogRef.close();
  }
}
