import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-add-foc-alert-popup',
  templateUrl: './add-foc-alert-popup.component.html'
})
export class AddFocAlertPopupComponent {
  constructor(public dialogRef: MatDialogRef<AddFocAlertPopupComponent>) {}


  close(): void {
    this.dialogRef.close(null);
  }
}
