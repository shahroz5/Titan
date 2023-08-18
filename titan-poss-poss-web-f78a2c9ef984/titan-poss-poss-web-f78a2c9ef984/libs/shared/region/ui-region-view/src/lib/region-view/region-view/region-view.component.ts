import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-region-view',
  templateUrl: './region-view.component.html'
})
export class RegionViewComponent {
  constructor(
    public dialogRef: MatDialogRef<RegionViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}


  onClose() {
    this.dialog.closeAll();
  }
}
