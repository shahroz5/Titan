import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-safe-gold',
  templateUrl: './safe-gold.component.html',
})
export class SafeGoldComponent {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<SafeGoldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }


  onClose() {
    this.dialogRef.close();
  }

}
