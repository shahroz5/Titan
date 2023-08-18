import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-reset-tcs-popup',
  templateUrl: './reset-tcs-popup.component.html'
})
export class ResetTcsPopupComponent {
  constructor(public dialogRef: MatDialogRef<ResetTcsPopupComponent>) {}


  close(): void {
    this.dialogRef.close(null);
  }
  continue() {
    this.dialogRef.close(true);
  }
}
