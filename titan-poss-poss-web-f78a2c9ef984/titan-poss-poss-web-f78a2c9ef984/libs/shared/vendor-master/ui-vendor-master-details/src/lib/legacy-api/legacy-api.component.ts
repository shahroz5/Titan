import { Component, Inject } from '@angular/core';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'poss-web-legacy-api',
  templateUrl: './legacy-api.component.html'
})
export class LegacyApiComponent  {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<LegacyApiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }


  onClose() {
    this.dialogRef.close();
  }
}
