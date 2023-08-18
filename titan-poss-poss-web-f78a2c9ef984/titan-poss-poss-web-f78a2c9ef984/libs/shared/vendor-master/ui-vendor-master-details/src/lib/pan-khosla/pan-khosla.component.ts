import { Component, Inject } from '@angular/core';
import { VENDOR_CODE_ENUMS } from '@poss-web/shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'poss-web-pan-khosla',
  templateUrl: './pan-khosla.component.html'
})
export class PanKhoslaComponent  {
  dialogData: any;
  VENDOR_CODE_ENUMS = VENDOR_CODE_ENUMS;

  constructor(
    public dialogRef: MatDialogRef<PanKhoslaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder
  ) {
    this.dialogData = data;
  }



  onClose() {
    this.dialogRef.close();
  }
}
