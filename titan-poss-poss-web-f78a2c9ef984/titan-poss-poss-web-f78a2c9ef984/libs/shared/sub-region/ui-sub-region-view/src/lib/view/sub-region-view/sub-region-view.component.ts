import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'poss-web-sub-region-view',
  templateUrl: './sub-region-view.component.html'
})
export class SubRegionViewComponent  {
  constructor(
    public dialogRef: MatDialogRef<SubRegionViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}


  getRegion(code) {
    return this.data.dropdown.filter(region => region.regionCode === code)[0]
      .description;
  }
  onClose() {
    this.dialog.closeAll();
  }
}
