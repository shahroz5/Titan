import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-terms-condtion',
  templateUrl: './terms-condtion.component.html'
})
export class TermsCondtionComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TermsCondtionComponent>
  ) {}

  close() {
    this.dialogRef.close(null);
  }
}
