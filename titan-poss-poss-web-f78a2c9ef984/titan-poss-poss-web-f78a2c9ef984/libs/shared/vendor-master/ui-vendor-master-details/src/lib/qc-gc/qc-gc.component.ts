import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-qc-gc',
  templateUrl: './qc-gc.component.html'
})
export class QcGcComponent {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<QcGcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }



  onClose() {
    this.dialogRef.close();
  }
}
