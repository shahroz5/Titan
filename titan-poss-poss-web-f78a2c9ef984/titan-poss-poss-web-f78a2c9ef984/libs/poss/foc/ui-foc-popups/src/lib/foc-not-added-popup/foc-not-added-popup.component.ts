import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FocNotAddedPopupConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-foc-not-added-popup',
  templateUrl: './foc-not-added-popup.component.html'
})
export class FocNotAddedPopupComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public config: FocNotAddedPopupConfig,
  public dialogRef: MatDialogRef<FocNotAddedPopupComponent>) {}


  close(): void {
    this.dialogRef.close(null);
  }
  continue() {
    this.dialogRef.close(true);
  }
  keepPending() {
    this.dialogRef.close('keepPending');
  }
}
